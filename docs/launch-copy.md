# gitshot — Launch Copy

All marketing copy for launch day. Non-cringy, developer-authentic.

---

## GitHub Repo Description

Upload images to GitHub issues, PRs, and comments from your terminal. 4 backends (GitHub Releases, Catbox, Cloudinary, imgbb). Zero runtime dependencies. Agent-friendly. Works over SSH and in CI.

## GitHub Topics

github, cli, images, screenshots, terminal, developer-tools, nodejs, typescript, productivity, command-line, github-actions, ai-agents, devtools, npm

---

## LinkedIn Post

I spent the weekend building a CLI tool that GitHub probably should have built five years ago.

The problem: GitHub has no API for uploading images to issues, PRs, or comments. The GitHub CLI team closed the feature request (#1895) because their upload endpoint requires browser session cookies, not API tokens. There's literally no programmatic way to do it.

If you file GitHub issues with screenshots (and you should), you know the pain: take screenshot, open browser, navigate to issue, drag image, wait for upload, copy URL, go back to terminal.

gitshot fixes this:

npx gitshot screenshot.png

One command. Image uploaded to GitHub Releases (permanent, CDN-backed URL), markdown printed to stdout. Pipe it into gh pr comment or gh issue create.

The technical approach:
- Uses the official GitHub Releases API (not the undocumented upload endpoint)
- 4 upload backends (GitHub Releases, Catbox, Cloudinary, imgbb)
- Zero runtime dependencies — just Node.js built-ins
- Agent-friendly: clean stdout, stderr logging, --json mode
- Works over SSH, in CI/CD, in containers — anywhere with a terminal

Built it because I needed it. Open sourced it because everyone else does too.

MIT license. TypeScript. npm install -g gitshot.

github.com/vipulgupta2048/gitshot

#opensource #cli #github #devtools #typescript

---

## Show HN

### Title
Show HN: Gitshot – Upload images to GitHub issues and PRs from the terminal

### Body
GitHub CLI can't upload images. Issue #1895 has been open since 2020, closed as "not planned." The upload endpoint requires browser session cookies, not OAuth tokens.

gitshot is a Node.js CLI that works around this by using GitHub Releases as an image backend:

    npx gitshot screenshot.png

It auto-creates a gitshot-images repo under your account, uploads the image as a release asset (permanent, CDN-backed URL), and prints markdown to stdout. Pipe it into gh pr comment or gh issue create.

4 backends (GitHub Releases, Catbox.moe, Cloudinary, imgbb), zero runtime dependencies, works over SSH and in CI. Designed to be agent-friendly: clean stdout, stderr for logs, --json mode, pipes into gh commands.

What it won't do:
- Use the undocumented uploads.github.com endpoint (could break anytime)
- Require browser automation (no Playwright)
- Need any deps beyond Node.js 22+

Repo: https://github.com/vipulgupta2048/gitshot

Happy to discuss the technical approach and trade-offs.

---

## Reddit r/commandline

### Title
gitshot - upload images to GitHub issues/PRs from the terminal (because gh can't)

### Body
GitHub CLI has been around since 2020 and it still can't upload images to issues or PRs. The team closed the feature request — the upload endpoint needs browser cookies, not API tokens. No API exists for it.

Built gitshot to fix this:

    npx gitshot screenshot.png

How it works: uploads your image as a GitHub Release asset (permanent, CDN-backed URL), prints markdown to stdout. Pipe it into `gh pr comment` or `gh issue create`.

4 backends: GitHub Releases (default), Catbox.moe (zero config), Cloudinary (CDN), imgbb (free). Auto-detects the best one.

Zero runtime dependencies. Works over SSH, in CI, in Docker. Agent-friendly (clean stdout, --json mode, no interactive prompts).

MIT license. TypeScript, Node 22+.

github.com/vipulgupta2048/gitshot

What would make this useful for your workflow?

---

## Reddit r/programming

### Title
GitHub has no API for uploading images to issues. I built a CLI to fix that.

### Body
For 5+ years, developers have been asking GitHub to support image uploads in the CLI (cli/cli#1895). The gh team closed it — the upload endpoint requires browser cookies, not API tokens.

gitshot works around this by using GitHub Releases as an image backend:

    npx gitshot screenshot.png | gh issue comment 42 --body-file -

It auto-creates a <user>/gitshot-images repo, uploads images as release assets (permanent URLs, CDN-backed), and outputs markdown to stdout.

4 backends (GitHub Releases, Catbox.moe, Cloudinary, imgbb). Zero runtime deps. Works over SSH and in CI. --json mode for AI agents.

TypeScript, MIT license.

https://github.com/vipulgupta2048/gitshot

---

## Reddit r/node

### Title
gitshot — Zero-dep Node.js CLI to upload images to GitHub issues/PRs

### Body
Built a CLI tool that uploads images to GitHub and returns markdown-ready URLs. Uses only Node.js 22+ built-ins (fetch, crypto, fs, child_process) — zero runtime dependencies.

    npx gitshot screenshot.png
    # -> ![screenshot](https://github.com/you/gitshot-images/releases/download/_gitshot/screenshot-a1b2c3d4.png)

4 upload backends with auto-detection:
1. GitHub Releases (if gh CLI authenticated)
2. Cloudinary (if CLOUDINARY_URL set)
3. imgbb (if IMGBB_API_KEY set)
4. Catbox.moe (fallback, always works)

Designed for piping: `gitshot img.png | gh pr comment 42 --body-file -`

GitHub doesn't have an API for uploading images to issues/PRs (cli/cli#1895, open since 2020). This is my workaround.

Source: https://github.com/vipulgupta2048/gitshot

---

## Social Card Text

Large text: gitshot
Subtitle: Images in GitHub, straight from your terminal.
Terminal mockup:
  $ npx gitshot bug.png --issue 42
  ✓ Uploaded -> github.com/.../bug-a3f2.png
  ✓ Markdown copied to clipboard
Bottom: MIT License | github.com/vipulgupta2048/gitshot

---

## GTM Launch Timeline

| Time | Channel | Content |
|------|---------|---------|
| 9am IST | Twitter/X | Launch thread (10 tweets) |
| 10am IST | Hacker News | Show HN post |
| 11am IST | LinkedIn | Professional post |
| 12pm IST | Reddit r/commandline | CLI-focused post |
| 2pm IST | Reddit r/programming | Technical post |
| 4pm IST | Dev.to | Full blog post |
| 6pm IST | Reddit r/node | Node.js community post |

## Engagement Rules

- Reply to every comment within 2 hours
- Be honest about limitations
- Thank people who try it
- File issues for every bug report received
- No voting rings on HN
