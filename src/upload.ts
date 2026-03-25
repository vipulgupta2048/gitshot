export interface UploadResult {
  url: string;
  filename: string;
  backend: string;
}

export interface Uploader {
  name: string;
  upload(filepath: string): Promise<UploadResult>;
}

export type BackendName = "catbox" | "cloudinary" | "imgbb" | "release";

export const SUPPORTED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".ico", ".tiff", ".avif",
]);

export function toMarkdown(result: UploadResult): string {
  const name = result.filename.replace(/\.[^.]+$/, "");
  return `![${name}](${result.url})`;
}

export function toJson(result: UploadResult): string {
  const name = result.filename.replace(/\.[^.]+$/, "");
  return JSON.stringify({
    url: result.url,
    markdown: `![${name}](${result.url})`,
    filename: result.filename,
    backend: result.backend,
  });
}
