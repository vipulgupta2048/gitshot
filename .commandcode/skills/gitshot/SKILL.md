---
name: gitshot
description: Upload screenshots and images to GitHub, returning markdown-ready URLs for PRs, issues, and comments. Can upload AND post to PRs/issues in one command. Use when needing to attach images to GitHub PRs/issues, upload screenshots, embed visuals in markdown, or when a workflow produces images that should be shared on GitHub. Trigger words - upload image, attach screenshot, add image to PR, embed screenshot, visual diff, before/after screenshot.
license: MIT
argument-hint: <image-path> [--pr N] [--issue N]
metadata:
  author: vipulgupta2048
  version: 0.1.0
---

# gitshot — Upload Images to GitHub

Upload images and post them to GitHub PRs/issues in one command. No piping needed.

## When to Use This Skill

- User asks to "upload", "attach", or "embed" an image/screenshot to a GitHub PR or issue
- A workflow produces screenshots or images that need to go into a PR comment or issue body
- User asks for a "visual diff", "before/after", or "screenshot" in a PR
- You have taken a screenshot and need to include it in GitHub markdown

## Quick Reference

```bash
# Upload + comment on a PR (ONE command, most common)
npx gitshot rick.gif --pr 42

# Upload + comment on PR with a caption
npx gitshot rick.gif --pr 42 -m "Here's the fix"

# Auto-detect PR from current branch
npx gitshot rick.gif --pr

# Upload + comment on an issue
npx gitshot rick.gif --issue 10

# Upload + create a new issue with image
npx gitshot bug.png --new-issue "Button is misaligned"

# Multiple images + caption
npx gitshot before.png after.png --pr 42 -m "Visual diff"

# Just upload, print markdown (no GitHub action)
npx gitshot rick.gif

# Raw URL only
npx gitshot --raw rick.gif

# JSON output for programmatic use
npx gitshot --json rick.gif
```

## How It Works

1. Uploads image to `<user>/gitshot-images` repo as a GitHub Release Asset (auto-created on first use)
2. If `--pr`, `--issue`, or `--new-issue` is set, posts a comment/creates the issue automatically
3. Always prints the markdown URL to stdout (composable even when posting)

## Key Flags

| Flag | What it does |
|------|-------------|
| `--pr [N]` | Comment on PR (auto-detects from branch if no number) |
| `--issue N` | Comment on issue |
| `--new-issue "title"` | Create new issue with image |
| `-m "text"` | Caption/message to include with image |
| `--raw` | Output raw URL only |
| `--json` | JSON output for scripts |

## Important Notes

- stdout = URLs/markdown only (pipe-safe)
- stderr = status messages
- Exit code 0 = success, 1 = failure
- Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP, BMP, ICO, TIFF, AVIF
- First run auto-creates `<user>/gitshot-images` repo (one-time)
