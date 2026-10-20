# dsh-openspec-opsx

English | [中文](README.zh.md)

Bring [OpenSpec](https://github.com/Fission-AI/OpenSpec)'s spec-driven development workflows into DeepSeek Harness: **12 `openspec-*` skills** plus **12 `/opsx-*` slash commands**.

- No runtime dependencies beyond the host's own `@deepseek-ai/dsh-llm`; no third-party skill kit.
- Every command declares `input.hint`, so the composer highlights it and waits for arguments instead of firing immediately.
- A command injects OpenSpec's own generated workflow prompt; whatever you type after the command is appended under `## 用户输入`.
- Skill bodies and command prompts are generated verbatim by `openspec init --tools claude`; this repository only wires them into DSH.

## Install

```sh
dsh plugin --profile desktop add dsh-openspec-opsx
```

Restart DSH afterwards. Until the package is on npm, install from GitHub:

```sh
dsh plugin --profile desktop add github:IDrinkMoreWater/dsh-openspec-opsx
```

## Commands

| Command | Purpose |
| --- | --- |
| `/opsx-propose` | Create a change and generate all planning artifacts in one step |
| `/opsx-explore` | Explore mode: think before committing |
| `/opsx-new` | Scaffold a new change |
| `/opsx-continue` | Create the next artifact in dependency order |
| `/opsx-ff` | Fast-forward every planning artifact |
| `/opsx-apply` | Implement tasks from `tasks.md` |
| `/opsx-update` | Revise planning artifacts coherently |
| `/opsx-verify` | Verify implementation matches artifacts |
| `/opsx-sync` | Merge delta specs into main specs |
| `/opsx-archive` | Archive a completed change |
| `/opsx-bulk-archive` | Archive several changes at once |
| `/opsx-onboard` | Guided walkthrough of the whole workflow |

```text
/opsx-explore should the CLI grow a --watch mode
/opsx-propose move login from sessions to JWT
```

## Skills

`openspec-propose`, `openspec-explore`, `openspec-new-change`, `openspec-continue-change`, `openspec-ff-change`, `openspec-apply-change`, `openspec-update-change`, `openspec-verify-change`, `openspec-sync-specs`, `openspec-archive-change`, `openspec-bulk-archive-change`, `openspec-onboard`.

The model loads one by description when the task matches; you can also ask for it explicitly.

## Why not `/opsx:explore`

DSH's command-name grammar is `/^[a-z][a-z0-9_-]*$/u` — a colon is not a legal character. Claude Code's `/opsx:explore` can only be `/opsx-explore` here.

## Prerequisites

- The target project needs an OpenSpec root: `openspec init` (or `openspec init --tools none`, since this plugin already ships the skills).
- The `openspec` CLI must be on `PATH`. This package's content is generated from **OpenSpec 1.14.3**.

## Regenerate for a newer OpenSpec

```sh
npm i -g @fission-ai/openspec@latest
node scripts/sync-openspec.mjs
```

The script runs `openspec init --tools claude` in a temporary directory (after opening the global workflow profile to all twelve workflows) and overwrites `skills/` and `commands/`. Commit the output so version drift stays reviewable.

## Layout

```text
index.js              registers skills and commands
skills/openspec-*/    12 SKILL.md files
commands/*.md         12 workflow prompts
cordis.patch.yml      bundle patch layer
scripts/sync-openspec.mjs
```

## License

MIT. Skill and command text comes from [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) (MIT).
