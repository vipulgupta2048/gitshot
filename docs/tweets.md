# gitshot Launch Thread — Twitter/X

Post as a thread from @vipulgupta2048. Stagger replies 2-3 minutes apart.

---

## Tweet 1 — Hook

I built gitshot because in 2026 there's still no way to upload an image to a GitHub issue from the terminal.

No, really. The gh CLI team closed the request. The API doesn't support it.

So here we are.

npx gitshot screenshot.png

github.com/vipulgupta2048/gitshot

---

## Tweet 2 — Problem

GitHub CLI can create issues, manage PRs, trigger workflows, and deploy releases.

It cannot upload a single screenshot.

Issue #1895 has been open since 2020. 32+ thumbs up. Closed. "Not planned."

github.com/cli/cli/issues/1895

---

## Tweet 3 — Demo

The whole workflow:

$ npx gitshot bug.png
-> Uploaded to GitHub Releases
-> Markdown URL printed to stdout

Pipe it:
$ gitshot bug.png | gh issue comment 42 --body-file -

No browser. No Playwright. No extensions.

[attach demo GIF]

---

## Tweet 4 — Zero deps

gitshot has zero runtime dependencies.

Not "minimal dependencies." Zero.

Node.js built-in fetch, crypto, fs, child_process. That's the whole stack.

npm install is instant. npx just works.

---

## Tweet 5 — Backends

4 upload backends, pick what works for you:

-> GitHub Releases (default, permanent URLs)
-> Catbox.moe (zero config, always works)
-> Cloudinary (CDN, free tier)
-> imgbb (simple, free)

Auto-detects the best one. Falls back gracefully.

---

## Tweet 6 — Agent-friendly

Built for the AI agent era:

- Clean stdout (just the URL/markdown)
- Logs on stderr (won't pollute pipes)
- --json mode for structured output
- Pipes directly into gh commands
- No interactive prompts, ever

Claude, Cursor, Copilot — they can all use this.

npx skills add vipulgupta2048/gitshot

---

## Tweet 7 — SSH/CI

Where gitshot works:

Your local terminal
SSH into a remote server
GitHub Actions
Docker containers
Codespaces
Any CI/CD pipeline

Where it doesn't work:

Nowhere, actually.

---

## Tweet 8 — vs alternatives

"Use gh-attach" -> Archived. Required Playwright.
"Use GHPic" -> macOS only. Needs Raycast.
"Just open a browser" -> I'm in an SSH session.
"Use the API" -> There is no API.

gitshot: zero deps, works everywhere.

---

## Tweet 9 — Install CTA

Try it right now:

npx gitshot your-image.png

Or install globally:

npm i -g gitshot

That's it. One command. Ships compiled JS, no build step needed.

github.com/vipulgupta2048/gitshot

---

## Tweet 10 — Vision

What's next for gitshot:

-> Clipboard paste (screenshot -> upload in one command)
-> gh extension polish
-> Before/after comparison tables
-> GitHub Actions action
-> More backends

The terminal is where we work. Images shouldn't require leaving it.
