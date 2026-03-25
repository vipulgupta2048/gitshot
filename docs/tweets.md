# gitshot Launch — Twitter/X

---

## Long-form Launch Tweet (Premium)

I built gitshot because it's 2026 and there's still no way to upload an image to a GitHub issue from the terminal.

The gh CLI team closed the request. Twice. Issue #1895 has been open since 2020. 32+ thumbs up. "Not planned."

So I built it myself.

$ npx gitshot rick.gif --pr 42
⠋ Uploading rick.gif...
✓ Uploaded rick.gif
⠋ Commenting on PR #42...
✓ Commented on PR #42

That's it. One command. Image uploaded. PR commented. No browser. No Playwright. No extensions.

How it works:
→ Auto-creates a gitshot-images repo under your GitHub account
→ Uploads images as Release Assets (permanent URLs, on GitHub infra)
→ Comments on PRs, issues, or creates new issues — all in one command
→ Falls back to catbox.moe if you don't have gh CLI
→ Zero runtime npm dependencies. Just Node.js built-ins.

Built for the AI agent era. Claude Code, Copilot, Cursor — they can all use this:

$ npx gitshot rick.gif --issue 10 -m "Here's the bug"
$ npx gitshot rick.gif --new-issue "UI is broken"
$ npx gitshot rick.gif --pr  ← auto-detects PR from branch
$ npx skills add vipulgupta2048/gitshot  ← installs the agent skill

--json mode for structured output. Clean stdout for piping. Spinner on stderr. Works over SSH, in CI, in Docker, in Codespaces.

Shot taken. PR updated. No browser needed.

github.com/vipulgupta2048/gitshot

[attach rick.gif demo / terminal recording]

---

## Thread version (if you prefer)

### Tweet 1 — Hook

I built gitshot because it's 2026 and there's still no way to upload an image to a GitHub issue from the terminal.

The gh CLI team closed the request. Twice.

So here we are:

$ npx gitshot rick.gif --pr 42
✓ Uploaded rick.gif
✓ Commented on PR #42

github.com/vipulgupta2048/gitshot

### Tweet 2 — The problem

GitHub CLI can create issues, manage PRs, trigger workflows, deploy releases.

It cannot upload a single screenshot.

Issue #1895: open since 2020. 32+ thumbs up. Closed as "Not planned."

github.com/cli/cli/issues/1895

### Tweet 3 — One command

Old way:
$ gitshot img.png | gh pr comment 42 --body-file -

New way:
$ gitshot rick.gif --pr 42

One command. Upload + comment. No piping.

Also:
--issue 10 → comment on issue
--new-issue "Bug" → create issue with image
--pr → auto-detect PR from branch
-m "caption" → add a message

### Tweet 4 — Agent-first

Built for AI agents:

$ npx gitshot rick.gif --pr 42 -m "Here's the fix"
⠋ Uploading rick.gif...
✓ Uploaded rick.gif
⠋ Commenting on PR #42...
✓ Commented on PR #42

Clean stdout. Spinner on stderr. --json mode. No prompts.

Install the skill for 40+ agents:
npx skills add vipulgupta2048/gitshot

### Tweet 5 — Zero deps

gitshot has zero runtime npm dependencies.

Not "minimal." Zero.

Node.js built-in fetch, crypto, fs, child_process. That's the whole stack.

4 backends: GitHub Releases, Catbox.moe, Cloudinary, imgbb.

Works over SSH. In CI. In Docker. Everywhere.

### Tweet 6 — CTA

Try it right now:

npx gitshot rick.gif

Shot taken. PR updated. No browser needed.

github.com/vipulgupta2048/gitshot
