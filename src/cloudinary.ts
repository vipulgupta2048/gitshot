import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { createHash } from "node:crypto";
import type { Uploader, UploadResult } from "./upload.js";

export class CloudinaryUploader implements Uploader {
  name = "cloudinary";
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    const url = process.env.CLOUDINARY_URL;
    if (!url) {
      throw new Error(
        "CLOUDINARY_URL env var not set.\n" +
        "Get your free URL at: https://cloudinary.com/console\n" +
        "Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
      );
    }

    // Parse cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    const match = url.match(/^cloudinary:\/\/(\d+):([^@]+)@(.+)$/);
    if (!match) {
      throw new Error(
        "Invalid CLOUDINARY_URL format.\n" +
        "Expected: cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
      );
    }

    this.apiKey = match[1];
    this.apiSecret = match[2];
    this.cloudName = match[3];
  }

  async upload(filepath: string): Promise<UploadResult> {
    const filename = basename(filepath);
    const fileBuffer = await readFile(filepath);
    const blob = new Blob([fileBuffer]);

    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Generate signature: sha1("timestamp={timestamp}{api_secret}")
    const signaturePayload = `timestamp=${timestamp}${this.apiSecret}`;
    const signature = createHash("sha1").update(signaturePayload).digest("hex");

    const form = new FormData();
    form.append("file", blob, filename);
    form.append("api_key", this.apiKey);
    form.append("timestamp", timestamp);
    form.append("signature", signature);

    const apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const res = await fetch(apiUrl, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
    }

    const data = await res.json() as { secure_url: string };
    return { url: data.secure_url, filename, backend: this.name };
  }
}
