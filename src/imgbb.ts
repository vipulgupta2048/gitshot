import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import type { Uploader, UploadResult } from "./upload.js";

const IMGBB_API = "https://api.imgbb.com/1/upload";

export class ImgbbUploader implements Uploader {
  name = "imgbb";
  private apiKey: string;

  constructor() {
    const key = process.env.IMGBB_API_KEY;
    if (!key) {
      throw new Error(
        "IMGBB_API_KEY env var not set.\n" +
        "Get your free API key at: https://api.imgbb.com/"
      );
    }
    this.apiKey = key;
  }

  async upload(filepath: string): Promise<UploadResult> {
    const filename = basename(filepath);
    const fileBuffer = await readFile(filepath);
    const base64 = fileBuffer.toString("base64");

    const params = new URLSearchParams({
      key: this.apiKey,
    });

    const form = new FormData();
    form.append("image", base64);
    form.append("name", filename.replace(/\.[^.]+$/, ""));

    const res = await fetch(`${IMGBB_API}?${params}`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`imgbb upload failed (${res.status}): ${text}`);
    }

    const data = await res.json() as { data: { url: string } };
    return { url: data.data.url, filename, backend: this.name };
  }
}
