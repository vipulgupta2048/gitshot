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

      // Construct the download URL directly (more reliable than querying)
      const url = `https://github.com/${this.repo}/releases/download/${this.tag}/${uploadName}`;
      return { url, filename: originalName, backend: this.name };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to upload to ${this.repo}: ${msg}`);
    } finally {
      try { unlinkSync(tmpPath); } catch { /* ignore */ }
    }
  }
}
