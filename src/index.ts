#!/usr/bin/env node

import { parseArgs } from "node:util";
import { existsSync } from "node:fs";
import { extname, resolve } from "node:path";
import { SUPPORTED_EXTENSIONS, toMarkdown, toJson } from "./upload.js";
import type { Uploader, BackendName, UploadResult } from "./upload.js";
import { CatboxUploader } from "./catbox.js";
import { CloudinaryUploader } from "./cloudinary.js";
import { ImgbbUploader } from "./imgbb.js";
import { ReleaseUploader, isGhAvailable, isGhAuthenticated } from "./release.js";
import { commentOnPR, commentOnIssue, createIssue, detectCurrentPR } from "./github.js";
import { Spinner } from "./spinner.js";

const VERSION = "0.0.1";

// ── Color helpers ───────────────────────────────────────────────
const c = (code: number, text: string) => `\x1b[38;5;${code}m${text}\x1b[0m`;
const bold = (text: string) => `\x1b[1m${text}\x1b[0m`;
const dim = (text: string) => `\x1b[2m${text}\x1b[0m`;
const ul = (text: string) => `\x1b[4m${text}\x1b[0m`;

// ── Banner ──────────────────────────────────────────────────────
function banner(): string {
  const art = [
    "  ██████╗ ██╗████████╗███████╗██╗  ██╗ ██████╗ ████████╗",
    " ██╔════╝ ██║╚══██╔══╝██╔════╝██║  ██║██╔═══██╗╚══██╔══╝",
    " ██║  ███╗██║   ██║   ███████╗███████║██║   ██║   ██║   ",
    " ██║   ██║██║   ██║   ╚════██║██╔══██║██║   ██║   ██║   ",
    " ╚██████╔╝██║   ██║   ███████║██║  ██║╚██████╔╝   ██║   ",
    "  ╚═════╝ ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ",
  ];

  const rowColors = [81, 75, 75, 69, 63, 60];

  return art.map((line, row) => {
    const color = rowColors[row];
    return [...line].map(ch => {
      if (ch === ' ') return ch;
      if ("╔╗╚╝═║".includes(ch)) return `\x1b[38;5;${color}m\x1b[2m${ch}\x1b[0m`;
      return `\x1b[38;5;${color}m${ch}\x1b[0m`;
    }).join('');
  }).join('\n');
}

function separator(): string {
  return dim("  ──────────────────────────────────────────────────────");
}

// ── Welcome message (no args) ───────────────────────────────────
function welcome(): string {
  return [
    "",
    banner(),
    `  ${c(75, "Shot taken. PR updated. No browser needed.")}  ${dim(`v${VERSION}`)}`,
    separator(),
    "",
    `  ${bold("Quick start:")}`,
    `  ${dim("$")} ${c(75, "gitshot")} rick.gif ${c(81, "--pr")} 42        ${dim("Upload + comment on PR")}`,
    `  ${dim("$")} ${c(75, "gitshot")} rick.gif ${c(81, "--issue")} 10     ${dim("Upload + comment on issue")}`,
    `  ${dim("$")} ${c(75, "gitshot")} rick.gif                  ${dim("Upload, print markdown")}`,
    "",
    `  ${bold("Commands:")}`,
    `  ${c(75, "gitshot")} <image> --pr [N]        Comment on PR`,
    `  ${c(75, "gitshot")} <image> --issue <N>     Comment on issue`,
    `  ${c(75, "gitshot")} <image> --new-issue "T"  Create issue with image`,
    `  ${c(75, "gitshot")} <image>                  Upload only, print URL`,
    `  ${c(75, "gitshot")} --help                   Full reference`,
    "",
    `  ${dim("Docs:")} ${ul(dim("https://github.com/vipulgupta2048/gitshot"))}`,
    "",
  ].join('\n');
}

// ── Help (--help) ───────────────────────────────────────────────
function helpText(): string {
  return [
    "",
    banner(),
    `  ${c(75, "Shot taken. PR updated. No browser needed.")}  ${dim(`v${VERSION}`)}`,
    separator(),
    "",
    `  ${bold("USAGE")}`,
    `    ${c(75, "gitshot")} <image> --pr [number]        ${dim("Upload + comment on PR")}`,
    `    ${c(75, "gitshot")} <image> --issue <number>     ${dim("Upload + comment on issue")}`,
    `    ${c(75, "gitshot")} <image> --new-issue "title"  ${dim("Upload + create new issue")}`,
    `    ${c(75, "gitshot")} <image> [image...]            ${dim("Upload only, print markdown")}`,
    "",
    `  ${bold("ACTIONS")} ${dim("(post to GitHub after upload)")}`,
    `        ${c(81, "--pr")} [number]        ${dim("Comment on PR (auto-detects from branch if no number)")}`,
    `        ${c(81, "--issue")} <number>     ${dim("Comment on issue")}`,
    `        ${c(81, "--new-issue")} <title>  ${dim("Create new issue with image")}`,
    `    ${c(81, "-m")} <text>               ${dim("Caption/message to include with image")}`,
    "",
    `  ${bold("OUTPUT")}`,
    `    ${c(81, "-r")}, ${c(81, "--raw")}              ${dim("Raw URL, no markdown")}`,
    `        ${c(81, "--json")}             ${dim('JSON: {"url","markdown","backend"}')}`,
    "",
    `  ${bold("BACKENDS")} ${dim("(auto-detected)")}`,
    `    ${c(81, "-b")}, ${c(81, "--backend")} <name>    ${dim("release | catbox | cloudinary | imgbb")}`,
    `        ${c(81, "--repo")} <owner/repo> ${dim("Target repo for release backend")}`,
    `        ${c(81, "--tag")} <name>        ${dim("Release tag (default: _gitshot)")}`,
    "",
    `    ${c(50, "release")}      ${bold("Default.")} GitHub Release Assets on <you>/gitshot-images`,
    `    ${c(50, "catbox")}       No config. catbox.moe — free, 200MB`,
    `    ${c(50, "cloudinary")}   Set ${c(81, "CLOUDINARY_URL")} — CDN, 25GB free`,
    `    ${c(50, "imgbb")}        Set ${c(81, "IMGBB_API_KEY")} — free, 32MB`,
    "",
    `  ${bold("EXAMPLES")}`,
    `    ${dim("$")} gitshot rick.gif --pr 42`,
    `    ${dim("$")} gitshot rick.gif --pr              ${dim("(auto-detect from branch)")}`,
    `    ${dim("$")} gitshot rick.gif --pr 42 -m "Before the fix"`,
    `    ${dim("$")} gitshot rick.gif --issue 10`,
    `    ${dim("$")} gitshot rick.gif --new-issue "UI is broken"`,
    `    ${dim("$")} gitshot before.png after.png --pr 42 -m "Visual diff"`,
    `    ${dim("$")} gitshot rick.gif                   ${dim("(just upload)")}`,
    `    ${dim("$")} gitshot --json shot.png`,
    "",
    separator(),
    `  ${dim("Docs & more:")} ${ul(dim("https://github.com/vipulgupta2048/gitshot"))}`,
    "",
  ].join('\n');
}

function error(msg: string): never {
  process.stderr.write(`\x1b[31merror:\x1b[0m ${msg}\n`);
  process.exit(1);
}

function detectBackend(explicit?: string, opts?: { repo?: string; tag?: string }): Uploader {
  if (explicit) {
    switch (explicit as BackendName) {
      case "catbox":
        return new CatboxUploader();
      case "cloudinary":
        return new CloudinaryUploader();
      case "imgbb":
        return new ImgbbUploader();
      case "release":
        return new ReleaseUploader(opts);
      default:
        error(`Unknown backend "${explicit}". Choose: release, catbox, cloudinary, imgbb`);
    }
  }

  if (process.env.CLOUDINARY_URL) return new CloudinaryUploader();
  if (process.env.IMGBB_API_KEY) return new ImgbbUploader();
  if (isGhAvailable() && isGhAuthenticated()) return new ReleaseUploader(opts);
  return new CatboxUploader();
}

function validateFile(filepath: string): string {
  const resolved = resolve(filepath);
  if (!existsSync(resolved)) {
    error(`File not found: ${filepath}`);
  }
  const ext = extname(resolved).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    error(
      `Unsupported file type "${ext}". Supported: ${[...SUPPORTED_EXTENSIONS].join(", ")}`
    );
  }
  return resolved;
}

/**
 * Build the comment body from uploaded results and an optional message.
 */
function buildBody(results: UploadResult[], message?: string): string {
  const images = results.map(r => toMarkdown(r)).join("\n");
  if (message) {
    return `${message}\n\n${images}`;
  }
  return images;
}

async function main() {
  let args;
  try {
    args = parseArgs({
      allowPositionals: true,
      options: {
        // Actions
        pr: { type: "string", default: undefined },
        issue: { type: "string", default: undefined },
        "new-issue": { type: "string", default: undefined },
        message: { type: "string", short: "m" },
        // Output
        backend: { type: "string", short: "b" },
        raw: { type: "boolean", short: "r", default: false },
        json: { type: "boolean", default: false },
        // Backend options
        repo: { type: "string" },
        tag: { type: "string" },
        // Meta
        version: { type: "boolean", short: "v", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    // Handle --pr with no value (bare flag) — parseArgs throws for string type
    // Re-parse treating --pr as a flag to detect this case
    if (msg.includes("--pr") || msg.includes("--issue")) {
      return handleBareFlag(process.argv.slice(2));
    }
    error(`${msg}\nRun "gitshot --help" for usage.`);
  }

  if (args.values.help) {
    console.log(helpText());
    process.exit(0);
  }

  if (args.values.version) {
    console.log(`gitshot v${VERSION}`);
    process.exit(0);
  }

  const files = args.positionals;
  if (files.length === 0) {
    console.log(welcome());
    process.exit(0);
  }

  const resolvedFiles = files.map(validateFile);

  let uploader: Uploader;
  try {
    uploader = detectBackend(args.values.backend, {
      repo: args.values.repo,
      tag: args.values.tag,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    error(msg);
  }


  const spin = new Spinner();

  // Upload each file
  const results: UploadResult[] = [];
  for (const filepath of resolvedFiles) {
    const name = filepath.split("/").pop() ?? filepath;
    spin.start(`Uploading ${name}...`);
    try {
      const result = await uploader.upload(filepath);
      results.push(result);
      spin.succeed(`Uploaded ${name}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      spin.fail(`Failed to upload ${name}: ${msg}`);
      process.exitCode = 1;
    }
  }

  if (results.length === 0) {
    process.exit(1);
  }

  // ── Post-upload actions ──────────────────────────────────────
  const prNumber = args.values.pr;
  const issueNumber = args.values.issue;
  const newIssueTitle = args.values["new-issue"];
  const message = args.values.message;

  if (prNumber !== undefined) {
    const body = buildBody(results, message);
    const num = prNumber || detectCurrentPR();
    if (!num) {
      error("Could not detect PR for current branch. Specify a number: --pr 42");
    }
    spin.start(`Commenting on PR #${num}...`);
    try {
      commentOnPR(num, body, args.values.repo);
      spin.succeed(`Commented on PR #${num}`);
    } catch (e: unknown) {
      spin.fail(`Failed to comment on PR #${num}`);
      error(e instanceof Error ? e.message : String(e));
    }
    for (const r of results) console.log(toMarkdown(r));

  } else if (issueNumber !== undefined) {
    if (!issueNumber) error("Issue number required: --issue 42");
    const body = buildBody(results, message);
    spin.start(`Commenting on issue #${issueNumber}...`);
    try {
      commentOnIssue(issueNumber, body, args.values.repo);
      spin.succeed(`Commented on issue #${issueNumber}`);
    } catch (e: unknown) {
      spin.fail(`Failed to comment on issue #${issueNumber}`);
      error(e instanceof Error ? e.message : String(e));
    }
    for (const r of results) console.log(toMarkdown(r));

  } else if (newIssueTitle !== undefined) {
    if (!newIssueTitle) error("Issue title required: --new-issue \"Bug report\"");
    const body = buildBody(results, message);
    spin.start("Creating issue...");
    try {
      const url = createIssue(newIssueTitle, body, args.values.repo);
      spin.succeed(`Created issue: ${url}`);
    } catch (e: unknown) {
      spin.fail("Failed to create issue");
      error(e instanceof Error ? e.message : String(e));
    }
    for (const r of results) console.log(toMarkdown(r));

  } else {
    // No action — just print URLs
    for (const r of results) {
      if (args.values.json) {
        console.log(toJson(r));
      } else if (args.values.raw) {
        console.log(r.url);
      } else {
        console.log(toMarkdown(r));
      }
    }
  }
}

/**
 * Handle --pr / --issue used as a bare flag (no value).
 * Re-parses argv manually to extract the flag and positionals.
 */
async function handleBareFlag(argv: string[]): Promise<void> {
  // Detect bare --pr (auto-detect PR from branch)
  const hasPr = argv.includes("--pr");
  const hasIssue = argv.includes("--issue");

  // Collect all non-flag positionals
  const files: string[] = [];
  let message: string | undefined;
  let backend: string | undefined;
  let repo: string | undefined;
  let tag: string | undefined;
  let raw = false;
  let json = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--pr" || arg === "--issue") continue;
    if (arg === "-m" || arg === "--message") { message = argv[++i]; continue; }
    if (arg === "-b" || arg === "--backend") { backend = argv[++i]; continue; }
    if (arg === "--repo") { repo = argv[++i]; continue; }
    if (arg === "--tag") { tag = argv[++i]; continue; }
    if (arg === "--raw" || arg === "-r") { raw = true; continue; }
    if (arg === "--json") { json = true; continue; }
    if (!arg.startsWith("-")) files.push(arg);
  }

  if (files.length === 0) error("No image files provided.");
  const resolvedFiles = files.map(validateFile);

  let uploader: Uploader;
  try {
    uploader = detectBackend(backend, { repo, tag });
  } catch (e: unknown) {
    error(e instanceof Error ? e.message : String(e));
  }


  const spin = new Spinner();
  const results: UploadResult[] = [];
  for (const filepath of resolvedFiles) {
    const name = filepath.split("/").pop() ?? filepath;
    spin.start(`Uploading ${name}...`);
    try {
      const result = await uploader.upload(filepath);
      results.push(result);
      spin.succeed(`Uploaded ${name}`);
    } catch (e: unknown) {
      spin.fail(`Failed to upload ${name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (results.length === 0) process.exit(1);

  if (hasPr) {
    const body = buildBody(results, message);
    const num = detectCurrentPR();
    if (!num) error("Could not detect PR for current branch. Specify a number: --pr 42");
    spin.start(`Commenting on PR #${num}...`);
    try {
      commentOnPR(num, body, repo);
      spin.succeed(`Commented on PR #${num}`);
    } catch (e: unknown) {
      spin.fail(`Failed to comment on PR #${num}`);
      error(e instanceof Error ? e.message : String(e));
    }
  } else if (hasIssue) {
    error("Issue number required: --issue 42");
  }

  for (const r of results) {
    if (json) console.log(toJson(r));
    else if (raw) console.log(r.url);
    else console.log(toMarkdown(r));
  }
}

main().catch((e) => {
  process.stderr.write(`\x1b[31mfatal:\x1b[0m ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
