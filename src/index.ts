#!/usr/bin/env node

import { parseArgs } from "node:util";
import { existsSync } from "node:fs";
import { extname, resolve } from "node:path";
import { SUPPORTED_EXTENSIONS, toMarkdown, toJson } from "./upload.js";
import type { Uploader, BackendName } from "./upload.js";
import { CatboxUploader } from "./catbox.js";
import { CloudinaryUploader } from "./cloudinary.js";
import { ImgbbUploader } from "./imgbb.js";
import { ReleaseUploader, isGhAvailable, isGhAuthenticated } from "./release.js";

const VERSION = "0.1.0";

const HELP = `
gitshot — One command. Image in your PR.

Upload images and get markdown-ready URLs for GitHub issues, PRs, and comments.
Designed for AI agents and humans. Zero config if you have gh CLI.

USAGE
  gitshot <image> [image...]           Upload image(s), print markdown to stdout
  gitshot --raw <image>                Print raw URL only
  gitshot --json <image>               Print JSON output (for LLMs/agents)
  gitshot --backend catbox <image>     Use a specific backend

FLAGS
  -b, --backend <name>    Upload backend: release, catbox, cloudinary, imgbb
  -r, --raw               Output raw URLs only, no markdown
      --json              Output JSON (machine-readable)
      --repo <owner/repo> Image repo for release backend (default: <you>/gitshot-images)
      --tag <name>        Release tag for release backend (default: _gitshot)
  -v, --version           Print version
  -h, --help              Show this help

BACKENDS (auto-detected in this order)
  release     DEFAULT if gh CLI is authenticated. Uploads to a dedicated
              GitHub repo (<you>/gitshot-images) as release assets.
              Images stay on GitHub. Permanent URLs. Works everywhere.
              Auto-creates the repo on first use.
  catbox      Fallback if no gh CLI. Uses catbox.moe (free, no signup, 200MB limit)
  cloudinary  Set CLOUDINARY_URL env var. Professional CDN. Free tier: 25GB
  imgbb       Set IMGBB_API_KEY env var. Free, simple, 32MB limit

AUTO-DETECTION
  1. --backend flag (if set)
  2. CLOUDINARY_URL env var → cloudinary
  3. IMGBB_API_KEY env var → imgbb
  4. gh CLI authenticated → release (uploads to <you>/gitshot-images)
  5. None of the above → catbox (always works, zero config)

ENVIRONMENT VARIABLES
  CLOUDINARY_URL    cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  IMGBB_API_KEY     API key from https://api.imgbb.com
  GITHUB_TOKEN      GitHub token (alternative to gh auth)

EXAMPLES
  # Upload a screenshot (auto-detects best backend)
  gitshot screenshot.png

  # Upload and comment on a PR
  gitshot screenshot.png | gh pr comment 42 --body-file -

  # Upload and create an issue with the image
  gitshot bug.png | gh issue create --title "Bug report" --body-file -

  # Upload multiple images
  gitshot before.png after.png

  # Get just the raw URL
  gitshot --raw screenshot.png

  # JSON output for agents/LLMs
  gitshot --json screenshot.png
  # → {"url":"https://...","markdown":"![...](...)","backend":"release"}

  # Use catbox.moe instead
  gitshot --backend catbox screenshot.png

  # Upload to a specific GitHub repo
  gitshot --repo myorg/assets screenshot.png

  # Use Cloudinary
  CLOUDINARY_URL=cloudinary://key:secret@cloud gitshot diagram.png

MORE INFO
  GitHub:  https://github.com/vipulgupta2048/gitshot
  Problem: https://github.com/cli/cli/issues/1895
`.trim();

function error(msg: string): never {
  process.stderr.write(`error: ${msg}\n`);
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

  // Auto-detect: env vars first, then gh, then catbox fallback
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

async function main() {
  let args;
  try {
    args = parseArgs({
      allowPositionals: true,
      options: {
        backend: { type: "string", short: "b" },
        raw: { type: "boolean", short: "r", default: false },
        json: { type: "boolean", default: false },
        repo: { type: "string" },
        tag: { type: "string" },
        version: { type: "boolean", short: "v", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    error(`${msg}\nRun "gitshot --help" for usage.`);
  }

  if (args.values.help) {
    console.log(HELP);
    process.exit(0);
  }

  if (args.values.version) {
    console.log(`gitshot v${VERSION}`);
    process.exit(0);
  }

  const files = args.positionals;
  if (files.length === 0) {
    error("No image files provided.\n\nUsage: gitshot <image> [image...]\nRun \"gitshot --help\" for full usage.");
  }

  // Validate all files first
  const resolvedFiles = files.map(validateFile);

  // Detect backend
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

  process.stderr.write(`Using ${uploader.name} backend\n`);

  // Upload each file
  const results = [];
  for (const filepath of resolvedFiles) {
    try {
      const result = await uploader.upload(filepath);
      results.push(result);

      if (args.values.json) {
        console.log(toJson(result));
      } else if (args.values.raw) {
        console.log(result.url);
      } else {
        console.log(toMarkdown(result));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      process.stderr.write(`error uploading ${filepath}: ${msg}\n`);
      process.exitCode = 1;
    }
  }

  if (results.length === 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  process.stderr.write(`fatal: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
