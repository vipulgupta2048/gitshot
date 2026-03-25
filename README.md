<p align="center">
  <img src="logo.png" alt="gitshot" width="600">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/gitshot"><img src="https://img.shields.io/npm/v/gitshot?style=for-the-badge&logo=npm&logoColor=white&label=npm&color=f38ba8" alt="npm"></a>
  <a href="https://github.com/vipulgupta2048/gitshot/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-a6e3a1?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="license"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D22-94e2d5?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="node"></a>
</p>

<p align="center">
  <b>Zero-config, agent-first CLI to upload images to issues, PRs, and comments.</b><br>
</p>

<p align="center">
  <img src="demo/gitshot-demo.gif" alt="gitshot demo" width="700">
</p>

Upload images from the terminal and get markdown-ready URLs for GitHub issues, PRs, and comments. Auto-detects the best backend. Built for AI agents and humans.

## Why do I need this?

GitHub has **no API** for uploading images to issues, PRs, or comments. This has been [requested since 2020](https://github.com/cli/cli/issues/1895) — 5+ years, no resolution. The `gh` CLI's `--body` only accepts text. AI agents can take screenshots but can't attach them. It's a gap you are bound to hit. 

`gitshot` fixes this in one command.

# Installation

**Install for Humans**

```bash
# Use directly with npx (zero install)
npx gitshot rick.gif

# Install globally
npm install -g gitshot
```

**Install for Agents**
Install the gitshot skill for Command Code, Claude Code, Cursor, Copilot, Codex, and [40+ other agents](https://skills.sh):

```bash
npx skills add vipulgupta2048/gitshot
```

Once installed, your agent automatically knows when and how to use `gitshot` — just ask it to "attach a screenshot to the PR" or "upload an image to the issue."

**Install as GitHub CLI Extension**

```bash
gh extension install vipulgupta2048/gitshot
gh shot rick.gif --pr 42
```

## Usage

```bash
# Upload + comment on a PR (one command)
gitshot rick.gif --pr 42

# Upload + comment with a caption
gitshot rick.gif --pr 42 -m "Here's the fix"

# Auto-detect PR from current branch
gitshot rick.gif --pr

# Upload + comment on an issue
gitshot rick.gif --issue 10

# Upload + create a new issue
gitshot rick.gif --new-issue "Button is misaligned"

# Multiple images with caption
gitshot before.png after.png --pr 42 -m "Visual diff"

# Just upload, print markdown (no GitHub action)
gitshot rick.gif

# Raw URL only (for scripting)
gitshot --raw rick.gif

# JSON output (for agents/LLMs)
gitshot --json rick.gif
# → {"url":"https://...","markdown":"![...](...)","backend":"release"}
```

## How It Works

If you have [`gh` CLI](https://cli.github.com) authenticated, `gitshot` creates a **dedicated public repo** (`<you>/gitshot-images`) and uploads images as GitHub Release Assets. URLs are permanent, hosted on GitHub infrastructure, and render in any GitHub markdown context. The repo is auto-created on first use.

No `gh`? It falls back to [catbox.moe](https://catbox.moe) — free, no signup, zero config.

## Backends

| Backend | Setup | Limits | Best for |
|---------|-------|--------|----------|
| **github releases** (default) | `gh` CLI authenticated | 2GB/file | Most reliable. Images on GitHub. |
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
gitshot rick.gif
```

Get your free URL at [cloudinary.com/console](https://cloudinary.com/console).

### Using imgbb

```bash
export IMGBB_API_KEY=your_api_key
gitshot rick.gif
```

Get your free key at [api.imgbb.com](https://api.imgbb.com).

### Using a specific repo

```bash
gitshot --repo myorg/my-images rick.gif
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

Code and assests licened under MIT.
Built by Vipul Gupta using Command Code. 
