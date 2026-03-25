import { execSync } from "node:child_process";

function exec(cmd: string): string {
  return execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function execSafe(cmd: string): string | null {
  try {
    return exec(cmd);
  } catch {
    return null;
  }
}

/**
 * Auto-detect PR number for current branch.
 * Returns the number or null if no PR is found.
 */
export function detectCurrentPR(): string | null {
  const pr = execSafe("gh pr view --json number -q .number");
  return pr || null;
}

/**
 * Comment on an existing PR with markdown body.
 */
export function commentOnPR(prNumber: string, body: string, repo?: string): void {
  const repoFlag = repo ? `--repo ${repo}` : "";
  execSync(
    `gh pr comment ${prNumber} ${repoFlag} --body ${shellQuote(body)}`,
    { stdio: ["pipe", "pipe", "pipe"] }
  );
}

/**
 * Comment on an existing issue with markdown body.
 */
export function commentOnIssue(issueNumber: string, body: string, repo?: string): void {
  const repoFlag = repo ? `--repo ${repo}` : "";
  execSync(
    `gh issue comment ${issueNumber} ${repoFlag} --body ${shellQuote(body)}`,
    { stdio: ["pipe", "pipe", "pipe"] }
  );
}

/**
 * Create a new issue with markdown body. Returns the issue URL.
 */
export function createIssue(title: string, body: string, repo?: string): string {
  const repoFlag = repo ? `--repo ${repo}` : "";
  return exec(
    `gh issue create --title ${shellQuote(title)} --body ${shellQuote(body)} ${repoFlag}`
  );
}

function shellQuote(s: string): string {
  // Use $'...' syntax which handles newlines and special chars
  return "$'" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'";
}
