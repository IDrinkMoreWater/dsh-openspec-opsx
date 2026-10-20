#!/usr/bin/env node
/**
 * Regenerate `skills/` and `commands/` from the installed `openspec` CLI.
 *
 * OpenSpec's Claude Code integration already produces exactly the shapes this
 * plugin consumer needs — one SKILL.md per workflow and one self-contained
 * prompt per slash command — so the plugin never re-implements the payload.
 * Run `npm i -g @fission-ai/openspec@latest` first, then commit the diff.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

/** Every workflow OpenSpec 1.x ships; `cli()` renders them all when selected. */
const WORKFLOWS = [
	'propose',
	'explore',
	'new',
	'continue',
	'apply',
	'ff',
	'sync',
	'archive',
	'verify',
	'update',
	'bulk-archive',
	'onboard',
]

/** Run the openspec CLI through the platform shell (it is a .cmd shim on Windows). */
function cli(args, cwd) {
	return execFileSync('openspec', args, {
		cwd,
		encoding: 'utf8',
		shell: process.platform === 'win32',
		stdio: ['ignore', 'pipe', 'pipe'],
	})
}

const version = cli(['--version'], ROOT).trim()
console.log(`openspec ${version}`)

// Open the global workflow profile to all twelve workflows so `init` emits every
// skill and command. Setting it repeatedly is harmless.
cli(['config', 'set', 'workflows', JSON.stringify(WORKFLOWS)], ROOT)
console.log(`workflows: ${WORKFLOWS.join(', ')}`)

const work = mkdtempSync(join(tmpdir(), 'openspec-opsx-'))
try {
	cli(['init', '--tools', 'claude'], work)

	const skillsDir = join(work, '.claude', 'skills')
	const commandsDir = join(work, '.claude', 'commands', 'opsx')
	const skillNames = readdirSync(skillsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort()
	const commandNames = readdirSync(commandsDir).filter((file) => file.endsWith('.md')).sort()

	if (skillNames.length === 0) throw new Error('openspec init produced no skills')
	if (commandNames.length === 0) throw new Error('openspec init produced no commands')

	rmSync(join(ROOT, 'skills'), { recursive: true, force: true })
	rmSync(join(ROOT, 'commands'), { recursive: true, force: true })
	cpSync(skillsDir, join(ROOT, 'skills'), { recursive: true })
	cpSync(commandsDir, join(ROOT, 'commands'), { recursive: true })

	console.log(`skills:   ${skillNames.length} -> ${skillNames.join(', ')}`)
	console.log(`commands: ${commandNames.length} -> ${commandNames.map((f) => '/opsx-' + f.slice(0, -3)).join(', ')}`)
} finally {
	rmSync(work, { recursive: true, force: true })
}
