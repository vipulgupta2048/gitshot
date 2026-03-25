# I built a CLI to upload images to GitHub because nobody else would

**Tags:** #github #cli #typescript #devtools #opensource

---

## The Problem Nobody Talks About

A GitHub issue with a screenshot is worth ten without one. A bug report with a visual is immediately actionable. A PR with before/after images tells the whole story.

But if you live in the terminal — and most of us do — uploading an image to a GitHub issue means:

1. Take the screenshot
2. Open a browser
3. Navigate to the issue
4. Click the comment box
5. Drag the image
6. Wait for upload
7. Go back to the terminal

Every. Single. Time.

You'd think the GitHub CLI would handle this. It handles everything else — creating issues, managing PRs, triggering workflows, deploying releases. But upload an image? [Issue #1895](https://github.com/cli/cli/issues/1895) has been open since **2020**. 32+ thumbs up. The team closed it. "Not planned."

The reason? GitHub's image upload endpoint (`uploads.github.com`) requires browser session cookies, not OAuth tokens. There's literally no API for it.

## The Graveyard

I'm not the first person to try solving this:

- **gh-attach**: Used Playwright to automate a headless browser. Required 200MB+ of browser binaries. Broke in SSH sessions, CI pipelines, and Docker containers. [Archived.](https://dev.to/atani/i-archived-my-cli-tool-gh-attach-after-realizing-playwright-cli-can-do-the-same-thing-upload-im-5cob)
- **GHPic**: A Raycast extension for macOS. Not a CLI. Not cross-platform.
- **imgur-upload-cli**: Uploads to imgur, not GitHub. Images can disappear.
- **Manual workarounds**: Upload to any image host, copy URL, paste markdown. Tedious.

None of these work where developers actually need them: the terminal, over SSH, inside CI.

## How gitshot Works

The key insight: **GitHub Releases assets are permanent, CDN-backed, and fully API-accessible.**

When you run `gitshot rick.gif --pr 42`, here's what happens:

1. gitshot uploads your image as a release asset to `<you>/gitshot-images` (auto-created on first run)
2. It gets a permanent URL: `https://github.com/you/gitshot-images/releases/download/_gitshot/rick-a1b2c3d4.gif`
3. It posts that image as a comment on PR #42

```bash
$ npx gitshot rick.gif --pr 42
⠋ Uploading rick.gif...
✓ Uploaded rick.gif
⠋ Commenting on PR #42...
✓ Commented on PR #42
![rick](https://github.com/you/gitshot-images/releases/download/_gitshot/rick-a1b2c3d4.gif)
```

One command. Upload + comment. No piping, no multi-step workflows.

```bash
# Comment on an issue
gitshot rick.gif --issue 10

# Comment with a caption
gitshot rick.gif --pr 42 -m "Here's the fix"

# Auto-detect PR from current branch
gitshot rick.gif --pr

# Create a new issue with image
gitshot rick.gif --new-issue "Button is broken"

# Just upload, print markdown
gitshot rick.gif
```

## Four Backends, One Interface

Not everyone has `gh` CLI set up. So gitshot supports four backends:

| Backend | Setup | Best for |
|---------|-------|----------|
| **release** | `gh` CLI authenticated | Permanent GitHub URLs (default) |
| **catbox** | Nothing | Quick uploads, zero config fallback |
| **cloudinary** | `CLOUDINARY_URL` env var | CDN, image transforms, production |
| **imgbb** | `IMGBB_API_KEY` env var | Simple free hosting |

Auto-detection picks the best available option. If `gh` is authenticated, it uses GitHub Releases. If not, it falls back to Catbox.moe — free, no signup, just works.

## Built for AI Agents

This is 2026. Half of us are pairing with AI agents. An agent can take a screenshot, but it can't upload it to a GitHub issue. Until now.

gitshot is agent-first:

- **One command** does upload + post (no piping two CLIs together)
- **stdout** contains only the URL/markdown — no noise
- **stderr** shows spinner progress — agents can ignore it
- **--json** returns structured output
- **No interactive prompts** — ever
- **Exit codes**: 0 = success, 1 = failure

```bash
# Agent workflow: upload + comment on PR in one shot
npx gitshot rick.gif --pr 42 -m "Here's the bug"

# Structured output for programmatic use
npx gitshot --json rick.gif
# → {"url":"https://...","markdown":"![...](...)","filename":"rick.gif","backend":"release"}
```

Install as an agent skill for Claude Code, Cursor, Copilot, and 40+ others:

```bash
npx skills add vipulgupta2048/gitshot
```

## Technical Decisions

### Zero runtime dependencies

gitshot uses only Node.js built-ins: `fetch` (Node 22+), `crypto`, `fs`, `child_process`, `util`. No `axios`, no `node-fetch`, no `commander`. The entire dependency tree is:

- 2 dev dependencies: `typescript` and `@types/node`
- 0 runtime dependencies

### TypeScript, not Go or Rust

For a tool like this, TypeScript is the right choice:

- **npx**: Zero-install execution. `npx gitshot` works on any machine with Node.js.
- **npm ecosystem**: Largest package registry. Easy discovery, easy install.
- **Fast enough**: The bottleneck is network I/O, not CPU.
- **Developer familiarity**: Most GitHub users already have Node.js.

## Try It

```bash
# One command, zero install
npx gitshot rick.gif --pr 42

# Install globally
npm install -g gitshot

# As a gh extension
gh extension install vipulgupta2048/gitshot
```

Shot taken. PR updated. No browser needed.

**GitHub**: [github.com/vipulgupta2048/gitshot](https://github.com/vipulgupta2048/gitshot)

---

*Built by [Vipul Gupta](https://github.com/vipulgupta2048). If this saves you time, star the repo. If it breaks, file an issue.*
