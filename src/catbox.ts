import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import type { Uploader, UploadResult } from "./upload.js";

const CATBOX_API = "https://catbox.moe/user/api.php";

export class CatboxUploader implements Uploader {
  name = "catbox";

  async upload(filepath: string): Promise<UploadResult> {
    const filename = basename(filepath);
    const fileBuffer = await readFile(filepath);

    const maxRetries = 3;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const blob = new Blob([fileBuffer]);
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", blob, filename);

        const res = await fetch(CATBOX_API, {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Catbox upload failed (${res.status}): ${text}`);
        }

        const url = (await res.text()).trim();

        if (!url.startsWith("https://")) {
          throw new Error(`Catbox returned unexpected response: ${url}`);
        }

        return { url, filename, backend: this.name };
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        if (attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError ?? new Error("Catbox upload failed after retries");
  }
}
