# dsh-openspec-opsx

[English](README.md) | 中文

把 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 的规格驱动开发工作流接入 DeepSeek Harness：**12 个 `openspec-*` 技能** + **12 个 `/opsx-*` 斜杠命令**。

- 零运行时依赖（只用 DSH 宿主自带的 `@deepseek-ai/dsh-llm`），不依赖任何第三方 skill kit。
- 命令声明了 `input.hint`，所以在输入框里会正常高亮、并停在那里等你补参数。
- 命令注入的是 OpenSpec 自己生成的**完整工作流提示词**；你在命令后面写的文字会以 `## 用户输入` 追加进去。
- 技能正文与命令正文由 `openspec init --tools claude` 原样生成，本仓库只做转接。

## 安装

```sh
dsh plugin --profile desktop add dsh-openspec-opsx
```

重启 DSH 后生效。npm 上暂未发布时，可从 GitHub 安装：

```sh
dsh plugin --profile desktop add github:IDrinkMoreWater/dsh-openspec-opsx
```

## 命令

| 命令 | 作用 |
| --- | --- |
| `/opsx-propose` | 一步生成 change 与全部规划产物 |
| `/opsx-explore` | 探索模式：想清楚再动手 |
| `/opsx-new` | 新建 change 脚手架 |
| `/opsx-continue` | 按依赖顺序创建下一个产物 |
| `/opsx-ff` | 快进生成全部规划产物 |
| `/opsx-apply` | 按 `tasks.md` 实现 |
| `/opsx-update` | 修订规划产物并保持一致 |
| `/opsx-verify` | 校验实现与产物一致 |
| `/opsx-sync` | delta spec 合并进主 specs |
| `/opsx-archive` | 归档已完成的 change |
| `/opsx-bulk-archive` | 批量归档 |
| `/opsx-onboard` | 完整流程引导 |

```text
/opsx-explore 要不要给 CLI 加一个 --watch 模式
/opsx-propose 把登录从 session 改成 JWT
```

## 技能

`openspec-propose`、`openspec-explore`、`openspec-new-change`、`openspec-continue-change`、`openspec-ff-change`、`openspec-apply-change`、`openspec-update-change`、`openspec-verify-change`、`openspec-sync-specs`、`openspec-archive-change`、`openspec-bulk-archive-change`、`openspec-onboard`。

模型会按描述自动加载对应技能；你也可以显式让它加载。

## 为什么不是 `/opsx:explore`

DSH 的命令名文法是 `/^[a-z][a-z0-9_-]*$/u`，**冒号不是合法字符**——Claude Code 的 `/opsx:explore` 在这里只能写成 `/opsx-explore`。

## 前置条件

- 目标项目需要 OpenSpec 根目录：`openspec init`（或 `openspec init --tools none`，因为技能已由本插件提供）。
- `openspec` CLI 需在 `PATH` 上。本插件的内容由 **OpenSpec 1.14.3** 生成。

## 从新版本 OpenSpec 重新生成

```sh
npm i -g @fission-ai/openspec@latest
node scripts/sync-openspec.mjs
```

脚本会在临时目录里跑 `openspec init --tools claude`（并先把全局 workflow profile 打开到全部 12 个），再把 `skills/` 与 `commands/` 覆盖进本仓库。生成结果请一并提交，方便 review 版本差异。

## 结构

```text
index.js              注册技能与命令
skills/openspec-*/    12 个 SKILL.md
commands/*.md         12 个工作流提示词
cordis.patch.yml      bundle patch 层
scripts/sync-openspec.mjs
```

## 许可

MIT。技能与命令正文来自 [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)（MIT）。
