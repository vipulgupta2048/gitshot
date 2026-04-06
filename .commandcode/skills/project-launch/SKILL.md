---
name: project-launch
description: End-to-end playbook for launching a CLI tool as an open-source project. Covers ideation, deep research, implementation, README polish, demo assets, social copy, outreach, and distribution. Distilled from the gitshot launch — a full conversation-to-ship cycle. Includes prompt patterns, pivot decisions, and Claude Code tactics.
license: MIT
argument-hint: [project-name]
metadata:
  author: vipulgupta2048
  version: 0.2.0
---

# Project Launch Skill

A repeatable playbook for launching a CLI/open-source project, distilled from the gitshot launch. This documents not just what was done, but the decisions, pivots, and lessons from the full conversation.

---

## Phase 0: Ideation + Deep Research

**What happened with gitshot:**
Started from a Slack screenshot showing a conversation about GitHub CLI's inability to attach images to PRs/issues. The user identified this as a viral CLI opportunity.

### Research Process
1. **Read the screenshot carefully** — extracted exact issue numbers, people mentioned, and the core pain point
2. **Deep-dive the upstream issues** — read ALL comments on the canonical issues (one from 2020, one from 2026)
3. **Cataloged 21+ existing tools** — none filling the gap:
   - gh-attach (Go, browser cookies) — fragile
   - Addono/gh-attach (TypeScript, MCP) — heavy
   - img402.dev (external service) — 7-day retention
   - images-upload-cli (Python, 49 stars) — no GitHub-native option
4. **Identified the gap** — no tool combined: zero-config + works with gh auth + headless + agent-first + minimal deps + one-command output
5. **Validated the opportunity** — 5.5 years of requests, 32+ thumbs up, AI agents making it urgent

### Decisions made in this phase
- **Language pivot**: User initially suggested Go → then reconsidered → chose Node.js for `npx` discoverability and npm ecosystem
- **Backend strategy**: Started with catbox.moe as default → pivoted to GitHub Release Assets after user pointed out reliability. Release assets became default, catbox became fallback
- **Scope**: Upload + return URL only (Unix philosophy). Actions (--pr, --issue) added later

### Checklist
- [ ] Identify a real pain point with evidence (GitHub issues, forum complaints, years of waiting)
- [ ] Research ALL existing tools — catalog what exists and why it's not enough
- [ ] Identify the specific gap your tool fills
- [ ] Validate with real user signals (thumbs up counts, comment frequency, years open)
- [ ] Choose language/runtime based on distribution strategy, not just preference
- [ ] Define MVP scope — what's the one command that tells the whole story?

---

## Phase 1: Core Product (Code + Package)

### Implementation Timeline
1. **Scaffolding** — package.json, tsconfig, directory structure
2. **Upload interface** — `Uploader` interface with `upload(filepath) → {url, filename, backend}`
3. **Backends built in order:**
   - Catbox.moe (simplest, zero config) — with retry logic for flaky connections
   - Cloudinary (parse CLOUDINARY_URL, multipart upload)
   - imgbb (base64 encode, POST)
   - GitHub Release Assets (the big one):
     - Auto-creates `<user>/gitshot-images` repo via `gh` API
     - Initializes empty repo with README via API (releases need at least one commit)
     - Creates `_gitshot` release tag
     - Uploads with random suffix to avoid collisions
     - Constructs download URL directly
4. **CLI entry point** — `node:util.parseArgs` (zero deps), file validation, backend auto-detection
5. **Post-upload actions** (added later based on user feedback):
   - `--pr [N]` — comment on PR (auto-detects from branch if no number)
   - `--issue N` — comment on issue
   - `--new-issue "title"` — create new issue
   - `-m "text"` — caption/message
6. **Spinner** (added later) — animated progress on stderr, TTY-aware (silent when piped)
7. **GitHub integration** — `gh pr comment`, `gh issue comment`, `gh issue create` via child_process

### Key Technical Decisions
- **Zero runtime deps** — only `typescript` and `@types/node` as devDeps
- **Node 22+** — for built-in `fetch()`, `FormData`, `Blob`
- **stdout = URLs only, stderr = logs** — critical for piping and agent use
- **Release assets as default** — permanent URLs, GitHub infrastructure, works with private repos (with auth)
- **Auto-create image repo** — `gh repo create`, then `gh api` to push initial README (empty repos can't have releases)
- **Bare `--pr` flag handling** — `parseArgs` throws for string type with no value, so added manual `handleBareFlag` fallback parser

### Gotchas Encountered
- Empty GitHub repos can't have releases → must push an initial commit via API first
- Catbox.moe rate-limits rapid sequential uploads → added retry with backoff
- `parseArgs` can't handle optional string values (bare `--pr`) → needed manual argv parsing
- Node.js `FormData` + `Blob` work differently than browser → had to read file into `Buffer` then wrap in `Blob`

### Checklist
- [ ] Ship a working v0.0.1 to npm (`npm publish`)
- [ ] Zero runtime dependencies if possible (Node built-ins only)
- [ ] Support multiple output modes: markdown, raw URL, JSON
- [ ] Add `--help` with clear usage examples and ASCII banner
- [ ] Make it work as a single command (upload + action, no piping required)
- [ ] Add spinner/progress feedback on stderr (TTY-aware)
- [ ] Register as gh CLI extension (`gh extension install`)
- [ ] Create agent skill file
- [ ] Publish agent skill (`npx skills add <author>/<name>`)

---

## Phase 2: Branding + Messaging

### The Tagline Evolution
This went through many iterations based on user feedback:

1. `"One command. Image in your PR."` — original, too generic
2. `"Upload. Get URL. Ship."` — user picked from 4 options (three-beat rhythm)
3. `"Screenshots in GitHub without a browser."` → `"Screenshots on GitHub, now without a browser."` — user corrected grammar
4. `"Shot taken. PR updated. No browser needed."` — user picked from 5 mixes of two candidates
5. Description: `"Zero-config, agent-first CLI to upload images to issues, PRs, and comments. Screenshots on GitHub, now without a browser."` — user wrote this themselves

### What to Learn
- **Give options, not answers** — present 3-4 tagline choices with previews
- **The user will riff** — they'll take pieces from different options and combine them
- **Update everywhere atomically** — when tagline changes, grep for ALL occurrences and update in one pass (README, CLI source, package.json, llms.txt, website, video, docs)
- **The user's voice wins** — the final tagline was the user's own creation, not any option presented

### Surfaces to Keep in Sync
When ANY branding text changes, update ALL of these:
- `package.json` description
- `README.md` (hero section + subtitle)
- `src/index.ts` (CLI banner + help screen)
- `llms.txt` and `llms-full.txt`
- `website/` copies
- `video/` scenes
- GitHub repo description (`gh repo edit --description`)
- Agent skill SKILL.md

---

## Phase 3: README + Visual Identity

### README Structure (final)
```
<p align="center"> logo.png </p>
<p align="center"> badges (npm, license, node) </p>
<p align="center"> tagline </p>
<p align="center"> demo GIF </p>

Why do I need this?
Installation (Humans / Agents / gh CLI)
Usage (code examples)
How It Works
Privacy notice
Backends table
Comparison table
Background
Contributing
License
```

### Design Directions
- Logo as top hero image (`logo.png`)
- Badges: rounded `for-the-badge` style, NOT flat
- Remove noisy badges (dependencies, stars, downloads early on)
- npm badge: distinctive color (`f38ba8` pink)
- Center-aligned header with `<p align="center">`
- Demo GIF right below tagline, 700px width
- Install section split into: Humans / Agents / gh CLI
- Privacy advisory as a blockquote after "How It Works"

### Checklist
- [ ] Create logo/banner image
- [ ] Center-aligned header: logo + badges + tagline
- [ ] Demo GIF below tagline
- [ ] Three install paths (npm, agent skill, gh extension)
- [ ] "Why" section leading with pain point
- [ ] Comparison table vs alternatives
- [ ] Privacy/security advisory if tool creates public resources
- [ ] Background section — explain the gap without spammy issue references

---

## Phase 4: Demo Assets

### VHS Demo Tape
The demo GIF went through iterations:
1. First version: just upload + issue command
2. Second version: added `npx gitshot` (banner) first, then two commands
3. Final structure: banner → upload → issue comment with caption

### Final VHS tape structure:
```
1. npx gitshot                                     (show the ASCII banner)
2. npx gitshot rick.gif                            (simple upload, spinner + URL)
3. npx gitshot rick.gif --issue 1 -m 'Rickrolling' (upload + action)
```

### Key Lessons
- **Use a fun test asset** — rick.gif makes demos memorable and shareable
- **Show the banner first** — gives people the brand impression
- **Keep it under 25 seconds** — attention spans are short
- **Use VHS (charmbracelet/vhs)** — reproducible terminal recordings from tape files

### Checklist
- [ ] Record terminal demo GIF using VHS
- [ ] Show banner first, then most common workflows
- [ ] Use a memorable test file (rick.gif, nyan.gif, etc.)
- [ ] Keep GIF under 1MB if possible
- [ ] Optionally create a Remotion video for social media

---

## Phase 5: Social Copy + Launch Content

### Platforms and Content Types
| Platform | Format | Key focus |
|----------|--------|-----------|
| Twitter/X | Long-form Premium tweet + thread | Hook + demo + install |
| LinkedIn | Professional post | Problem → solution → bigger vision |
| Hacker News | Show HN | Technical approach + trade-offs |
| Reddit | r/commandline, r/programming, r/node | Community-specific framing |
| Dev.to | Blog post | Thought leadership angle |

### Blog Post Approach
The blog evolved from a "how I built it" post to a thought leadership piece:
- **Don't lead with the tool** — lead with the insight ("Agents can't show their proof of work")
- **Frame the gap, not the feature** — agents collaborating on GitHub without visual evidence
- **The tool is the resolution**, not the topic
- **Keep technical details brief** — readers care about the problem more than architecture

### Tweet Strategy
- User wrote their own tweet, asked for help refining specific lines
- Formula: **Pop culture hook** (Taylor Swift quote) + **problem statement** + **bigger vision tease**
- Don't over-polish — the user's authentic voice > copywriter perfection
- Offer 5 versions of a line, let user pick and remix

### Checklist
- [ ] Write launch tweet (include demo GIF, hero command, install)
- [ ] Write LinkedIn post (professional, problem-first)
- [ ] Prepare Show HN (technical, honest about trade-offs)
- [ ] Prepare Reddit posts (community-specific framing)
- [ ] Write a blog post (thought leadership angle, not just a tutorial)
- [ ] Keep docs/ folder gitignored — launch copy is local-only, never published

---

## Phase 6: Distribution + Outreach

### CRITICAL: Avoid Cross-Reference Spam
**Never put external issue numbers in commit messages.** Writing `org/repo#1234` in a commit message creates a cross-reference on that issue — every rebase/amend creates ANOTHER reference. This makes you look spammy on upstream issues.

Rules:
- **Commit messages**: NO issue refs to external repos. Ever.
- **README**: Use full URLs or describe the problem without issue numbers
- **Reference upstream issues ONCE** in the README background section, max
- **Blog posts and tweets**: Full URLs are fine (no auto-linking outside GitHub)

### How Claude Code Researched Outreach Targets

The user's prompt: *"Where can I post about gitshot in actual user threads, issues, PRs, reddit, social threads. Give me all the links from web search research."*

**Tactic: Parallel WebSearch in waves of 4.** Each wave targets a different angle. Results are categorized into tiers and presented as tables with URL + angle.

**Wave 1 — Core pain point:**
```
site:github.com/cli/cli/issues "upload image" "issue" "PR" "comment" "API"
site:reddit.com "github upload image programmatically"
site:github.com "github image upload API missing feature" issues
site:stackoverflow.com "attach screenshot github PR programmatically"
```

**Wave 2 — Adjacent ecosystems:**
```
github MCP server upload image attachment site:github.com
"github upload image issue API" reddit 2024 2025
AI agent screenshot github PR cursor copilot claude
github actions screenshot PR comment image upload
```

**Wave 3 — Deeper cuts (after user asked "give me 20 more"):**
```
stackoverflow github API upload image issue comment attachment
microsoft vscode-pull-request-github image paste screenshot site:github.com
github docs embed image attachment API site:github.com/github/docs
playwright cypress visual test screenshot upload PR github action
```

**Wave 4 — Fill the gaps:**
```
"gh-attach" OR "ghpic" OR "github image upload" tool CLI alternative
github community discussion upload file attachment REST API 2024 2025
bitbucket jira image upload pull request comment API limitation
stackoverflow github embed image pull request API programmatically
```

**What worked:**
- `site:github.com/orgs/community/discussions` is a goldmine — users asking the exact question your tool answers
- VS Code extension repos (`microsoft/vscode-pull-request-github`) are underrated targets
- CI/testing tool issues (Cypress, Playwright) surface users who need image-in-PR workflows
- Competitor tool searches (`gh-attach`, `GHPic`) find articles comparing approaches
- GitHub docs repo issues surface documentation gaps you can fill

**What failed:**
- `site:reddit.com` with specific terms → returns empty almost every time. Drop the site filter.
- `site:stackoverflow.com` → same problem. Search without site filter, let SO surface naturally.
- First attempt used Agent tool for parallel search — user rejected it. Switched to direct WebSearch calls.

### Where to Post (by priority)

**Tier 1 — GitHub Issues (highest signal, careful about spam)**
Found ~15 threads for gitshot:
- The upstream feature request (cli/cli#1895 — the 5+ year old mothership issue)
- Duplicate/related issues (cli/cli#4228, #4465, #9046)
- GitHub CLI discussions (cli/cli Discussion #4745)
- GitHub MCP server (github/github-mcp-server#738)
- Unofficial trackers (isaacs/github#1133)
- Claude Code issues (anthropics/claude-code#31210)

**Tier 2 — GitHub Community Discussions**
Found ~10 threads:
- REST API upload requests (#46951, #157555, #24723, #68171)
- Image comment API (#28219, #147466)
- Upload failures/frustrations (#47688, #50303, #28947, #74738)
- Token access for PR images (#69034)

**Tier 3 — IDE / VS Code**
Found ~3 threads:
- VS Code PR extension image paste broken (#5348, #2760)
- Core VS Code markdown image pasting (#106955)

**Tier 4 — AI Agent / Copilot threads**
Found ~5 threads:
- Copilot can't attach images (#153112)
- Copilot adding screenshots to PRs (#169913)
- Copilot can't read images (#171733)
- Pasting screenshots in Copilot Chat (#150766)

**Tier 5 — Q&A and Forums**
- Stack Overflow (github API image upload questions)
- Dev.to articles about screenshot automation
- Blog comment sections (Marek Šuppa, Semantic Art, coreyja)
- Gists with manual workarounds
- Medium articles about GitHub API file uploads
- Zenn articles about gh-attach (competitor, Japanese dev audience)

**Tier 6 — CI / Visual Regression**
- Cypress PR screenshot issues (cypress-io/github-action#193)
- Playwright screenshot upload issues
- GitHub Actions marketplace (comment-pr-with-images, upload-image, screenshot actions)
- Blog posts about CI screenshot workflows

**Tier 7 — Social**
- Reddit (r/github, r/programming, r/webdev, r/commandline)
- Hacker News (Show HN + related threads)
- Twitter/X (reply to people complaining about the problem)

### Outreach Templates

User's prompt: *"Create a nice little template reply I can post on these places with installation instruction, demo link, tweet link and repo link."*

Then refined: *"Generate markdown I can easily copy"* — wanted raw markdown, not explanation + markdown mixed together.

Then: *"Convert to table"* — for the install section specifically.

**GitHub Issues (detailed):**
```markdown
I built [**<tool>**](https://github.com/<author>/<tool>) to solve exactly this — <one-line description>.

\`\`\`bash
# One command — uploads and comments on a PR
npx <tool> screenshot.png --pr 42
\`\`\`

<2-3 sentences on how it works>

It also works as a `gh` extension:
\`\`\`bash
gh extension install <author>/<tool>
gh shot screenshot.png --pr 42
\`\`\`

Or install as an [agent skill](https://github.com/<author>/<tool>) for Claude Code, Cursor, Copilot, and 40+ other AI coding agents:
\`\`\`bash
npx skills add <author>/<tool>
\`\`\`

[Demo](<tweet-link>) | [Repo](https://github.com/<author>/<tool>)
```

**Short version (Reddit, HN, blog replies):**
```markdown
I hit this wall too, so I built [<tool>](https://github.com/<author>/<tool>) — <one-line description>.

npx <tool> screenshot.png --pr 42

<one sentence on mechanism>

[Repo](https://github.com/<author>/<tool>) | [Demo](<tweet-link>)
```

**One-liner (drive-by comments):**
```markdown
Shameless plug: I built [<tool>](https://github.com/<author>/<tool>) for this — `npx <tool> img.png --pr 42`. No <pain-point> needed. [Demo](<link>)
```

**Dev.to / blog comment:**
```markdown
Nice post! If anyone's looking for a simpler approach — I built [<tool>](https://github.com/<author>/<tool>), <one-line description>:

npx <tool> screenshot.png --pr 42

<one sentence on mechanism>. Also works as a `gh` CLI extension and as a skill for AI coding agents.

[GitHub](https://github.com/<author>/<tool>) | [Demo](<tweet-link>)
```

**Install table (reusable in any template):**
```markdown
| Method | Command |
|--------|---------|
| Install globally | `npm i -g <tool>` |
| Install as gh CLI extension | `gh extension install <author>/<tool>` |
| Install as agent skill | `npx skills add <author>/<tool>` |
```

### Checklist
- [ ] Run 4-wave parallel web search to find all relevant threads
- [ ] Categorize results into tiers (GitHub issues > Community > IDE > AI > Q&A > CI > Social)
- [ ] Generate outreach templates (detailed, short, one-liner, blog comment)
- [ ] Post on the upstream issue (ONE comment, not spam)
- [ ] Show HN submission
- [ ] Reddit posts in relevant subs
- [ ] Reply to people complaining about the problem on Twitter
- [ ] Comment on competitor tool articles/repos
- [ ] Comment on CI/testing blog posts and issues
- [ ] Monitor and respond to all comments within 2 hours

---

## Phase 7: npm Publish + GitHub Release

### npm Publish Gotchas
- Need `npm login` first (interactive, can't be automated by agent)
- 2FA OTP required — user must run `npm publish --otp=CODE` themselves
- `prepublishOnly` script should run `tsc` build
- `files` array in package.json controls what gets published — keep it minimal
- **Don't publish docs/, video/, demo tapes** — only dist/, skills/, README, LICENSE

### GitHub Push Gotchas
- Remote may have changes from other sessions → always `git pull --rebase` before push
- If rebase fails due to unstaged changes → `git stash && git pull --rebase && git stash pop`
- Force push only when explicitly asked
- Make atomic commits — each commit is one logical change

### Checklist
- [ ] Verify `npm whoami` is authenticated
- [ ] Ensure `files` array excludes docs/, video/, demo/
- [ ] Build before publish (`npm run build`)
- [ ] `npm publish --access public --otp=CODE`
- [ ] Push all commits to GitHub
- [ ] Update GitHub repo description via `gh repo edit --description`

---

## Key Lessons from the gitshot Launch

### Product
1. **Start with the gap, not the feature** — "GitHub has no API for image uploads" is the hook
2. **One hero command** — `npx gitshot rick.gif --pr 42` tells the whole story
3. **Agent-first means one command** — agents shouldn't pipe two CLIs together. `--pr 42` beats `| gh pr comment 42 --body-file -`
4. **Auto-detect everything** — PR from branch, backend from env vars, repo from gh auth
5. **Privacy advisory early** — if your tool creates public repos, warn users upfront

### Branding
6. **Give tagline options with previews** — user picks, then remixes
7. **Update every surface atomically** — grep for old text, replace everywhere in one pass
8. **Fun test assets** — rick.gif makes demos memorable and tweets shareable
9. **Three install paths** — npm, gh extension, agent skill covers all user types
10. **Rounded badges, minimal set** — `for-the-badge` style, skip deps/stars badges early

### Process
11. **Never put external issue refs in commits** — creates spammy cross-references on upstream issues
12. **Keep docs/ gitignored** — launch copy, tweets, blog drafts are local-only
13. **Atomic commits** — each commit should be one logical change
14. **User voice wins** — present options, let the user write the final copy
15. **Test with real uploads** — don't just unit test, actually upload and verify URLs work

### Social
16. **Lead with thought leadership** — "Agents can't show their proof of work" > "I built a CLI tool"
17. **Pop culture hooks work** — Taylor Swift quote made the tweet memorable
18. **Don't over-reveal the bigger vision** — tease without exposing product details
19. **Blog ≠ README** — blog is about the problem and insight, README is about usage

### Outreach
20. **Outreach is a research task** — treat finding threads like finding code: parallel queries, multiple waves, categorize results
21. **Templates need multiple tones** — GitHub issue reply ≠ Reddit comment ≠ drive-by one-liner
22. **Ask for copyable markdown explicitly** — default Claude Code output mixes explanation with content; say "generate markdown I can easily copy"
23. **Ask for volume** — "give me 20 more links" forces deeper searching past the first page of results
24. **Provide reference links in your prompt** — give Claude Code the exact tweet URL, repo URL, demo link to embed, don't make it guess

---

## Prompt Patterns That Worked (from this conversation)

These are actual prompts from the launch sessions, annotated with why they worked:

### 1. Batch design directions in one prompt
> "Remove dependencies, stars badges. Make them rounded. Change the npm color to something else. Make the README heading center aligned and great looking. Use @logo.png as your top image."

**Why:** Multiple related changes applied in one read-edit cycle. Avoids 5 back-and-forth turns.

### 2. One-word action prompts
> "push"

**Why:** After a commit, intent is obvious. Claude Code stages, commits, pushes in one flow.

### 3. Ask for specific output format
> "Convert to table" / "Generate markdown I can easily copy"

**Why:** Claude Code defaults to mixing explanation with content. Explicitly requesting format (table, raw markdown, code block) gets usable output in one shot.

### 4. Ask for volume with a number
> "Give me 20 more links like this"

**Why:** Forces additional search waves. Without a number, Claude Code stops after the first pass of results.

### 5. Provide all reference links upfront
> "Create a template reply with installation instruction, demo link, tweet link and repo link from my github https://x.com/vipulgupta2048/status/..."

**Why:** Gives Claude Code the exact assets to embed. No follow-up questions needed.

### 6. Ask Claude Code to document its own process
> "Summarize this entire conversation into a project launch skill. Including changes I have made in each commit or direction I have given to Claude Code."

**Why:** Turns a one-off session into a reusable skill. Claude Code reconstructs the process from git history + conversation context.

### 7. Iterative refinement in short prompts
> First: "Create a template" → Then: "Generate markdown I can easily copy" → Then: "Convert to table"

**Why:** Each prompt narrows the output format. Faster than explaining the exact format upfront.

---

## Claude Code Tactics & Behaviors

### What worked well
- **Parallel WebSearch x4** — 4 simultaneous searches per wave, 4 waves total = ~50 links in minutes
- **Read before edit** — always read the file before modifying, even if just wrote it
- **Single Edit for multiple changes** — all badge changes in one Edit operation, not 4 separate ones
- **Categorized output as tables** — tiers with URL + title + angle columns for quick scanning
- **Multiple template variants** — created 4 tones (detailed, short, one-liner, blog) without being asked
- **Git workflow** — `git add <specific files>` (not `git add .`) + signed commits + push

### What to watch for
- **Cannot access other CC sessions** — each conversation is isolated. Only git history, disk files, and current conversation available.
- **`site:reddit.com` searches return empty** — always have a fallback query without site: filter
- **`site:stackoverflow.com` also fails frequently** — same, drop the site filter
- **Agent tool may be rejected** — user denied Agent for web search, switched to direct WebSearch. Always have a fallback.
- **Files may be edited externally between turns** — README was modified outside Claude Code by user/linter between prompts. Always re-read before assuming content matches.
- **User edits the skill file themselves between sessions** — the skill grew from 206 lines to 320+ lines from user's own additions from other sessions. Always read current state before updating.
