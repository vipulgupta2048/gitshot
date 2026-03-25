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

- **gh-attach**: The closest thing to a real solution. It used Playwright to automate a headless browser for uploads. Clever, but it required 200MB+ of browser binaries. It broke in SSH sessions, CI pipelines, and Docker containers. [It's been archived.](https://dev.to/atani/i-archived-my-cli-tool-gh-attach-after-realizing-playwright-cli-can-do-the-same-thing-upload-im-5cob)

- **GHPic**: A Raycast extension for macOS. Not a CLI. Not cross-platform. Requires Raycast.

- **imgur-upload-cli**: Uploads to imgur, not GitHub. Images can disappear. No integration with issues or PRs.

- **Manual workarounds**: Upload to any image host, copy URL, paste markdown. Fragile, tedious, breaks the flow.

None of these work in the place where developers actually need them: the terminal, over SSH, inside CI.

## How gitshot Works

The key insight: **GitHub Releases assets are permanent, CDN-backed, and fully API-accessible.**

When you run `gitshot screenshot.png`, here's what happens:

1. gitshot checks if `gh` CLI is authenticated (most devs already have this)
2. It creates a dedicated repo: `<your-username>/gitshot-images` (auto-created on first run)
3. It uploads your image as a release asset to a `_gitshot` tagged release
4. It returns a permanent URL: `https://github.com/you/gitshot-images/releases/download/_gitshot/screenshot-a1b2c3d4.png`
5. That URL works everywhere GitHub renders markdown — issues, PRs, comments, READMEs, gists

```bash
$ npx gitshot screenshot.png
![screenshot](https://github.com/you/gitshot-images/releases/download/_gitshot/screenshot-a1b2c3d4.png)
```

The URL is on GitHub's own infrastructure. It renders natively. No external dependencies. No risk of the image disappearing because an image host shut down.

## Four Backends, One Interface

Not everyone has `gh` CLI set up. Maybe you're on a fresh machine, or in a minimal Docker container, or you don't want to create another repo. So gitshot supports four backends:

| Backend | Setup | Best for |
|---------|-------|----------|
| **release** | `gh` CLI authenticated | Permanent GitHub URLs (default) |
| **catbox** | Nothing | Quick uploads, zero config fallback |
| **cloudinary** | `CLOUDINARY_URL` env var | CDN, image transforms, production |
| **imgbb** | `IMGBB_API_KEY` env var | Simple free hosting |

Auto-detection picks the best available option. If `gh` is authenticated, it uses GitHub Releases. If not, it falls back to Catbox.moe — free, no signup, just works.

```bash
# Force a specific backend
gitshot --backend catbox screenshot.png

# Cloudinary via env var
CLOUDINARY_URL=cloudinary://key:secret@cloud gitshot diagram.png
```

## Built for AI Agents

This is 2026. Half of us are pairing with AI agents. An agent can take a screenshot, but it can't upload it to a GitHub issue. Until now.

gitshot is designed to be agent-friendly:

- **stdout** contains only the URL or markdown — no noise
- **stderr** contains status messages and logs — agents can ignore it
- **--json** mode returns structured output: `{"url", "markdown", "filename", "backend"}`
- **No interactive prompts** — ever
- **Exit codes** are clean: 0 = success, 1 = failure
- **Pipes directly** into `gh` commands

```bash
# Agent workflow: screenshot → issue comment
npx gitshot screenshot.png | gh issue comment 42 --body-file -

# Agent workflow: structured output
npx gitshot --json screenshot.png
# → {"url":"https://...","markdown":"![...](...)","filename":"screenshot.png","backend":"release"}
```

You can install it as an AI agent skill:

```bash
npx skills add vipulgupta2048/gitshot
```

Once installed, your agent knows when and how to use gitshot. Ask it to "attach a screenshot to the PR" and it handles the rest.

## Technical Decisions

### Zero runtime dependencies

gitshot uses only Node.js built-ins: `fetch` (Node 22+), `crypto`, `fs`, `child_process`, `util`. No `axios`, no `node-fetch`, no `commander`. The entire dependency tree is:

- 2 dev dependencies: `typescript` and `@types/node`
- 0 runtime dependencies

This means `npm install` is near-instant and `npx gitshot` downloads just the compiled JS — no dependency resolution, no supply chain risk.

### TypeScript, not Go or Rust

For a tool like this, TypeScript is the right choice:

- **npx**: Zero-install execution. `npx gitshot` works on any machine with Node.js. No downloading platform-specific binaries.
- **npm ecosystem**: The largest package registry. Easy discovery, easy install.
- **Fast enough**: The bottleneck is network I/O (uploading images), not CPU. TypeScript adds no meaningful overhead.
- **Developer familiarity**: Most GitHub users already have Node.js installed.

A Go or Rust binary would require platform-specific downloads, Homebrew taps, or installation scripts. `npx` is universal.

### ES Modules, Node 22+

gitshot requires Node.js 22+ because it uses the built-in `fetch` API (stable in Node 22). This eliminates the need for `node-fetch` or `undici` as dependencies. Node 22 is LTS as of 2025, so this is a reasonable minimum.

## Try It

```bash
# One command, zero install
npx gitshot your-image.png

# Install globally
npm install -g gitshot

# As a gh extension
gh extension install vipulgupta2048/gitshot
```

It's MIT licensed. The code is straightforward — about 400 lines of TypeScript across 6 files. PRs welcome.

**GitHub**: [github.com/vipulgupta2048/gitshot](https://github.com/vipulgupta2048/gitshot)

## What's Next

- Clipboard paste: `gitshot --paste` to upload directly from clipboard
- GitHub Actions action: `uses: vipulgupta2048/gitshot-action@v1`
- Before/after comparison: Generate side-by-side markdown tables
- More backends: S3, R2, custom servers

The terminal is where we work. Images shouldn't require leaving it.

---

*Built by [Vipul Gupta](https://github.com/vipulgupta2048). If this saves you time, star the repo. If it breaks, file an issue.*
