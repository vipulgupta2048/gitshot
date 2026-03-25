# gitshot

[![npm version](https://img.shields.io/npm/v/gitshot?style=flat-square)](https://www.npmjs.com/package/gitshot)
[![CI](https://img.shields.io/github/actions/workflow/status/vipulgupta2048/gitshot/ci.yml?style=flat-square)](https://github.com/vipulgupta2048/gitshot/actions)
[![license](https://img.shields.io/github/license/vipulgupta2048/gitshot?style=flat-square)](https://github.com/vipulgupta2048/gitshot/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/gitshot?style=flat-square)](https://www.npmjs.com/package/gitshot)

**One command. Image in your PR.**

Upload images from the terminal and get markdown-ready URLs for GitHub issues, PRs, and comments. Auto-detects the best backend. Built for AI agents and humans.

<!-- TODO: Replace with actual demo GIF after recording with VHS -->
<!-- <p align="center"><img src="demo/gitshot-demo.gif" alt="gitshot demo" width="700"></p> -->

```bash
$ npx gitshot screenshot.png
![screenshot](https://github.com/you/gitshot-images/releases/download/_gitshot/screenshot-a1b2c3d4.png)
```

## Why?

GitHub has **no API** for uploading images to issues, PRs, or comments. This has been [requested since 2020](https://github.com/cli/cli/issues/1895) — 5+ years, no resolution. The `gh` CLI's `--body` only accepts text. AI agents can take screenshots but can't attach them.

`gitshot` fixes this in one command.

## Install

```bash
# Use directly with npx (zero install)
npx gitshot screenshot.png

# Install globally
npm install -g gitshot

# As a gh CLI extension
gh extension install vipulgupta2048/gitshot
gh shot screenshot.png
```

## Usage

```bash
# Upload a screenshot (auto-detects best backend)
gitshot screenshot.png

# Upload and comment on a PR — one pipeline
gitshot screenshot.png | gh pr comment 42 --body-file -

# Upload and create an issue with an image
gitshot bug.png | gh issue create --title "Bug report" --body-file -

# Multiple images
gitshot before.png after.png

# Raw URL only (for scripting)
gitshot --raw screenshot.png

# JSON output (for agents/LLMs)
gitshot --json screenshot.png
# → {"url":"https://...","markdown":"![...](...)","backend":"release"}
```

## How It Works

If you have [`gh` CLI](https://cli.github.com) authenticated, `gitshot` creates a **dedicated public repo** (`<you>/gitshot-images`) and uploads images as GitHub Release Assets. URLs are permanent, hosted on GitHub infrastructure, and render in any GitHub markdown context. The repo is auto-created on first use.

No `gh`? It falls back to [catbox.moe](https://catbox.moe) — free, no signup, zero config.

## Backends

| Backend | Setup | Limits | Best for |
|---------|-------|--------|----------|
| **release** (default) | `gh` CLI authenticated | 2GB/file | Most reliable. Images on GitHub. |
| **catbox** (fallback) | None | 200MB/file | No `gh` CLI, quick and dirty |
| **cloudinary** | `CLOUDINARY_URL` env var | 25GB free | Production, CDN, transforms |
| **imgbb** | `IMGBB_API_KEY` env var | 32MB/file | Simple free hosting |

### Auto-detection order

1. `--backend` flag → use that
2. `CLOUDINARY_URL` env var → Cloudinary
3. `IMGBB_API_KEY` env var → imgbb
4. `gh` CLI authenticated → **release** (creates `<you>/gitshot-images`)
5. None of the above → **catbox**

### Using Cloudinary

```bash
export CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
gitshot screenshot.png
```

Get your free URL at [cloudinary.com/console](https://cloudinary.com/console).

### Using imgbb

```bash
export IMGBB_API_KEY=your_api_key
gitshot screenshot.png
```

Get your free key at [api.imgbb.com](https://api.imgbb.com).

### Using a specific repo

```bash
gitshot --repo myorg/my-images screenshot.png
```

## Agent Skill

Install the gitshot skill for Claude Code, Cursor, Copilot, Codex, and [40+ other agents](https://skills.sh):

```bash
npx skills add vipulgupta2048/gitshot
```

Once installed, your agent automatically knows when and how to use `gitshot` — just ask it to "attach a screenshot to the PR" or "upload an image to the issue."

### GitHub CLI Extension

```bash
gh extension install vipulgupta2048/gitshot
gh shot screenshot.png
gh shot screenshot.png | gh pr comment 42 --body-file -
```

### Agent-Friendly Design

| Feature | Detail |
|---------|--------|
| **Zero config** | `npx gitshot <file>` works with just `gh` auth |
| **Clean stdout** | Only URLs/markdown to stdout. Logs to stderr. |
| **JSON mode** | `--json` returns `{"url", "markdown", "filename", "backend"}` |
| **Composable** | Pipe output to any `gh` command |
| **No prompts** | Never asks for interactive input |
| **Exit codes** | 0 = success, 1 = failure |

## CLI Reference

```
gitshot [flags] <image> [image...]

Flags:
  -b, --backend <name>    release | catbox | cloudinary | imgbb
  -r, --raw               Output raw URL only
      --json              Output JSON (machine-readable)
      --repo <owner/repo> Target repo for release backend
      --tag <name>        Release tag (default: _gitshot)
  -v, --version           Print version
  -h, --help              Show help with examples

Environment Variables:
  CLOUDINARY_URL    cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  IMGBB_API_KEY     API key from https://api.imgbb.com
  GITHUB_TOKEN      GitHub token (alternative to gh auth)

Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP, BMP, ICO, TIFF, AVIF
```

## Comparison

| Feature | gitshot | gh-attach | GHPic | Manual upload |
|---------|---------|-----------|-------|---------------|
| Zero dependencies | Yes | Playwright | Raycast | N/A |
| No browser needed | Yes | No | No | No |
| Works over SSH | Yes | No | No | No |
| Works in CI | Yes | No | No | No |
| Cross-platform | Yes | Partial | macOS only | Yes |
| Agent-friendly | Yes | No | No | No |
| Multiple backends | 4 | 1 | 1 | Manual |
| Status | **Active** | Archived | Active | N/A |

## Background

This tool exists because of these long-standing issues:

- [cli/cli#1895](https://github.com/cli/cli/issues/1895) — Upload and Embed Files to PRs/Issues/Comments (2020, open 5+ years)
- [cli/cli#12960](https://github.com/cli/cli/issues/12960) — Support image/file attachments (critical for agentic workflows)
- [github-mcp-server#738](https://github.com/github/github-mcp-server/issues/738) — Allow uploading files as attachments

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT
