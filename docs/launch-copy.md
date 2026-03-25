# gitshot — Launch Copy

All marketing copy for launch day.

---

## GitHub Repo Description

Zero-config, agent-first CLI to upload images to issues, PRs, and comments. Screenshots on GitHub, now without a browser.

## GitHub Topics

github, cli, images, screenshots, terminal, developer-tools, nodejs, typescript, productivity, command-line, github-actions, ai-agents, devtools, npm

---

## LinkedIn Post

I spent the weekend building a CLI tool that GitHub probably should have built five years ago.

The problem: GitHub has no API for uploading images to issues, PRs, or comments. The gh CLI team closed the feature request (#1895) — the upload endpoint requires browser cookies, not API tokens. There's no programmatic way to do it.

gitshot fixes this:

$ npx gitshot rick.gif --pr 42
✓ Uploaded rick.gif
✓ Commented on PR #42

One command. Image uploaded to GitHub Releases (permanent URL), posted as a PR comment. No browser, no Playwright, no browser cookies.

What makes it different:
→ Upload AND post to PRs/issues in one command (--pr, --issue, --new-issue)
→ Auto-detects PR from current branch (just --pr, no number needed)
→ 4 upload backends (GitHub Releases, Catbox, Cloudinary, imgbb)
→ Zero runtime npm dependencies — just Node.js built-ins
→ Agent-first: clean stdout, --json mode, spinner on stderr
→ Works over SSH, in CI/CD, in containers — anywhere with a terminal

Built it because AI coding agents (Claude Code, Copilot, Codex) can take screenshots but have no way to attach them to PRs. Now they can:

npx skills add vipulgupta2048/gitshot

Shot taken. PR updated. No browser needed.

MIT license. TypeScript. github.com/vipulgupta2048/gitshot

#opensource #cli #github #devtools #typescript #ai

---

## Show HN

### Title
Show HN: Gitshot – Upload images to GitHub PRs and issues from the terminal

### Body
GitHub CLI can't upload images. Issue #1895 has been open since 2020, closed as "not planned." The upload endpoint requires browser cookies, not OAuth tokens.

gitshot is a zero-dep Node.js CLI that fixes this:

    $ npx gitshot rick.gif --pr 42
    ✓ Uploaded rick.gif
    ✓ Commented on PR #42

One command: uploads the image as a GitHub Release asset (permanent URL), then posts it as a PR comment. No piping needed.

    $ gitshot rick.gif --issue 10 -m "Here's the bug"
    $ gitshot rick.gif --new-issue "Button is broken"
    $ gitshot rick.gif --pr   # auto-detects PR from branch

4 backends (GitHub Releases, Catbox.moe, Cloudinary, imgbb). Zero runtime dependencies. Agent-first design: --json mode, clean stdout, spinner on stderr, no interactive prompts.

Works over SSH, in CI, in Docker. Built because AI coding agents can take screenshots but have no way to attach them to PRs.

Repo: https://github.com/vipulgupta2048/gitshot

---

## Reddit r/commandline

### Title
gitshot — upload images to GitHub issues/PRs from the terminal, in one command

### Body
GitHub CLI has been around since 2020 and still can't upload images. The team closed the feature request — the upload endpoint needs browser cookies, not API tokens.

Built gitshot to fix this:

    $ npx gitshot rick.gif --pr 42
    ✓ Uploaded rick.gif
    ✓ Commented on PR #42

How it works: uploads your image as a GitHub Release asset, then posts it as a comment on the PR/issue. One command, no piping.

    --pr [N]           comment on PR (auto-detects from branch)
    --issue N          comment on issue
    --new-issue "T"    create new issue with image
    -m "caption"       add a message

4 backends: GitHub Releases (default), Catbox.moe (zero config), Cloudinary (CDN), imgbb (free). Zero runtime deps. Works over SSH, in CI, in Docker.

github.com/vipulgupta2048/gitshot

---

## Reddit r/programming

### Title
GitHub has no API for uploading images to issues. I built a CLI to fix that.

### Body
For 5+ years, developers have asked GitHub to support image uploads in the CLI (cli/cli#1895). Closed as "not planned."

gitshot works around this:

    $ npx gitshot rick.gif --pr 42
    ✓ Uploaded rick.gif
    ✓ Commented on PR #42

Uploads images as GitHub Release assets (permanent URLs), then posts them to PRs/issues. One command. Also supports --issue, --new-issue, and -m for captions.

Zero runtime deps. 4 backends. Agent-first design (--json, clean stdout, no prompts). Works everywhere including SSH and CI.

https://github.com/vipulgupta2048/gitshot

---

## Reddit r/node

### Title
gitshot — Zero-dep Node.js CLI to upload images to GitHub PRs/issues in one command

### Body
Built a CLI that uploads images to GitHub and posts them to PRs/issues. Uses only Node.js 22+ built-ins (fetch, crypto, fs, child_process) — zero runtime dependencies.

    $ npx gitshot rick.gif --pr 42
    ✓ Uploaded rick.gif
    ✓ Commented on PR #42

    $ gitshot rick.gif --issue 10 -m "Here's the bug"
    $ gitshot rick.gif --new-issue "UI is broken"

4 upload backends with auto-detection. Spinner UX on stderr, clean stdout for piping. --json mode for agents.

GitHub doesn't have an API for uploading images to issues/PRs (cli/cli#1895, open since 2020). This is my workaround.

Source: https://github.com/vipulgupta2048/gitshot

---

## Social Card Text

Large text: gitshot
Subtitle: Shot taken. PR updated. No browser needed.
Terminal mockup:
  $ npx gitshot rick.gif --pr 42
  ✓ Uploaded rick.gif
  ✓ Commented on PR #42
Bottom: MIT License | github.com/vipulgupta2048/gitshot

---

## GTM Launch Timeline

| Time | Channel | Content |
|------|---------|---------|
| 9am IST | Twitter/X | Long-form launch tweet (Premium) |
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
