import { execSync } from "node:child_process";
import { basename } from "node:path";
import { copyFileSync, unlinkSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Uploader, UploadResult } from "./upload.js";

const DEFAULT_TAG = "_gitshot";
const DEFAULT_IMAGE_REPO = "gitshot-images";

function exec(cmd: string): string {
  return execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function execSilent(cmd: string): boolean {
  try {
    execSync(cmd, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

export function isGhAvailable(): boolean {
  return execSilent("gh --version");
}

export function isGhAuthenticated(): boolean {
  return execSilent("gh auth status");
}

export function getGhUsername(): string {
  return exec("gh api user -q .login");
}

function validateRepoSafety(repo: string): void {
  const [owner] = repo.split("/");
  if (!owner) {
    throw new Error(`Invalid repo format "${repo}". Expected: owner/repo`);
  }

  // Check that the owner is a personal user account, not an organization
  try {
    const ownerType = exec(`gh api users/${owner} -q .type`);
    if (ownerType !== "User") {
      throw new Error(
        `Cannot use repo "${repo}" — owner "${owner}" is a ${ownerType}, not a personal user account.\n` +
        "gitshot only creates releases on personal user repos to avoid leaking images into org-owned repos.\n" +
        "Omit --repo to auto-create a personal image hosting repo."
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("Cannot use repo")) throw e;
    throw new Error(
      `Cannot verify owner "${owner}" of repo "${repo}".\n` +
      "Ensure the owner exists and you have access."
    );
  }

  // Check that the repo is public (not private/internal)
  try {
    const visibility = exec(`gh repo view ${repo} --json visibility -q .visibility`);
    if (visibility !== "PUBLIC") {
      throw new Error(
        `Cannot use repo "${repo}" — it is ${visibility.toLowerCase()}.\n` +
        "gitshot only uploads to public repos to prevent accidental exposure of private repo release assets.\n" +
        "Use a public repo or omit --repo to auto-create one."
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("Cannot use repo")) throw e;
    // Repo may not exist yet — that's okay, ensureImageRepo will create it as public
  }
}

export class ReleaseUploader implements Uploader {
  name = "release";
  private tag: string;
  private repo: string;

  constructor(opts?: { tag?: string; repo?: string }) {
    this.tag = opts?.tag ?? DEFAULT_TAG;

    // Check gh is available
    if (!isGhAvailable()) {
      throw new Error(
        "gh CLI not found. Required for release backend.\n" +
        "Install: https://cli.github.com\n" +
        "Or use: gitshot --backend catbox <file>"
      );
    }

    // Check auth
    if (!isGhAuthenticated()) {
      throw new Error(
        "gh CLI not authenticated. Run: gh auth login\n" +
        "Or set GITHUB_TOKEN env var."
      );
    }

    if (opts?.repo) {
      validateRepoSafety(opts.repo);
      this.repo = opts.repo;
    } else {
      // Auto-create a dedicated image hosting repo for the user
      const username = getGhUsername();
      this.repo = `${username}/${DEFAULT_IMAGE_REPO}`;
      this.ensureImageRepo(username);
    }
  }

  private ensureImageRepo(username: string): void {
    // Check if the repo exists and is non-empty (has commits)
    try {
      const defaultBranch = exec(
        `gh repo view ${this.repo} --json defaultBranchRef -q .defaultBranchRef.name`
      );
      if (defaultBranch) return; // Repo exists and has commits
      // Repo exists but is empty — need to initialize it
      this.initializeRepo();
      return;
    } catch {
      // Repo doesn't exist — create it
    }

    process.stderr.write(`Creating ${this.repo} for image hosting...\n`);
    try {
      exec(
        `gh repo create ${DEFAULT_IMAGE_REPO} --public ` +
        `--description "Image hosting for GitHub issues & PRs. Managed by gitshot."`
      );
      this.initializeRepo();
    } catch (e) {
      throw new Error(
        `Failed to create repo ${this.repo}.\n` +
        `Create it manually: gh repo create ${DEFAULT_IMAGE_REPO} --public\n` +
        `Or specify a repo: gitshot --repo owner/repo <file>`
      );
    }
  }

  private initializeRepo(): void {
    // Push an initial commit via the GitHub API so releases work
    // Uses the API to create a file without needing a local clone
    process.stderr.write(`Initializing ${this.repo}...\n`);
    try {
      const readmeContent = Buffer.from(
        "# gitshot-images\\n\\nImage hosting for GitHub issues & PRs.\\nManaged by [gitshot](https://github.com/vipulgupta2048/gitshot).\\n"
      ).toString("base64");

      exec(
        `gh api repos/${this.repo}/contents/README.md ` +
        `--method PUT ` +
        `--field message="Initial commit" ` +
        `--field content="${readmeContent}"`
      );
    } catch {
      throw new Error(
        `Failed to initialize ${this.repo}. The repo needs at least one commit for releases to work.\n` +
        `Push a commit manually, or delete and retry: gh repo delete ${this.repo} --yes`
      );
    }
  }

  private ensureRelease(): void {
    if (execSilent(`gh release view ${this.tag} --repo ${this.repo}`)) {
      return;
    }

    // Create the release
    try {
      exec(
        `gh release create ${this.tag} --repo ${this.repo} ` +
        `--title "gitshot uploads" ` +
        `--notes "Image hosting managed by [gitshot](https://github.com/vipulgupta2048/gitshot). Do not delete this release." ` +
        `--latest=false`
      );
    } catch (e) {
      throw new Error(
        `Failed to create release "${this.tag}" on ${this.repo}.\n` +
        `Ensure you have write access to the repo.`
      );
    }
  }

  async upload(filepath: string): Promise<UploadResult> {
    this.ensureRelease();

    const originalName = basename(filepath);
    const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")) : "";
    const stem = originalName.replace(/\.[^.]+$/, "");
    const suffix = randomUUID().slice(0, 8);
    const uploadName = `${stem}-${suffix}${ext}`;

    // Copy to temp with the new name (gh release upload uses the filename)
    const tmpPath = join(tmpdir(), uploadName);
    copyFileSync(filepath, tmpPath);

    try {
      execSync(
        `gh release upload ${this.tag} "${tmpPath}" --repo ${this.repo} --clobber`,
        { stdio: "pipe" }
      );

      // GitHub replaces spaces with dots in release asset filenames,
      // so we must match that in the constructed URL
      const assetName = uploadName.replace(/ /g, ".");
      const url = `https://github.com/${this.repo}/releases/download/${this.tag}/${assetName}`;
      return { url, filename: originalName, backend: this.name };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to upload to ${this.repo}: ${msg}`);
    } finally {
      try { unlinkSync(tmpPath); } catch { /* ignore */ }
    }
  }
}
