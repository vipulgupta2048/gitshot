# Social Preview Image — Gemini Prompt

Use this prompt in Google Gemini (or any image generation AI) to create the GitHub social preview image.

## Prompt

```
Create a social media preview image (1280x640 pixels) for "gitshot" — a CLI tool that uploads images to GitHub from the terminal.

Visual concept:
- The left half shows a minimal terminal window. The right half shows a GitHub PR comment with an embedded image — connected by a glowing green (#a6e3a1) arrow or stream of pixels flowing from terminal to GitHub, conveying "image goes from CLI → GitHub."

Color palette (Catppuccin Mocha — use these exact hex values):
- Background: deep dark base #1e1e2e with a subtle radial glow of green (#a6e3a1) at ~8% opacity behind the center, giving depth without a gradient
- Terminal surface: #313244 with rounded corners (12px), classic three dots (red #f38ba8, yellow #f9e2af, green #a6e3a1) in the top bar on mantle #181825
- Text colors: green #a6e3a1 for commands/prompts, white #cdd6f4 for output, dim #585b70 for status lines

Terminal content (left side):
  $ npx gitshot screenshot.png --pr 42
  ✔ Uploaded to vipul/gitshot-images
  ✔ Commented on PR #42
  ![screenshot](https://github.com/…/screenshot-a3f2.png)

GitHub mockup (right side):
- A simplified GitHub PR comment card (white/light themed, like actual GitHub UI) showing an embedded image thumbnail with a small green checkmark badge, as if the image just landed in the PR

Branding:
- Top-left: the gitshot logo — bold monospace "gs" in green (#a6e3a1) inside a rounded dark rectangle (#1e1e2e), like the favicon
- Top-center or just right of the logo: "gitshot" in large bold monospace (JetBrains Mono style), white #cdd6f4
- Below the name: tagline "Images in GitHub, straight from your terminal." in muted #a6adc8, smaller weight
- Bottom-right: "MIT · Zero Dependencies · Node 22+" in muted #585b70, small text

Style rules:
- Flat design only. No 3D, no drop shadows on the main card, no stock photos, no realistic photos.
- The green pixel-stream or arrow connecting terminal → GitHub is the hero visual element — make it feel like data in motion (think: a dotted trail of small green squares dissolving from left to right)
- Overall aesthetic: like a Charm.sh or Linear product card — premium, dark, developer-first, confident.
- Do NOT include any human faces, hands, or camera icons. This is about code and terminals, not photography.

Output as a high-resolution PNG at exactly 1280x640 pixels.
```

## Usage

1. Generate the image using the prompt above
2. Save as `website/og-image.png` (1280x640)
3. Set as GitHub repo social preview: Settings → General → Social preview
4. Reference in website `<meta>` tags for Open Graph

## Fallback

If AI generation doesn't produce good results, create manually:
- Use Figma with Catppuccin Mocha theme
- JetBrains Mono font for all text
- Left: terminal mockup with the command above
- Right: simplified GitHub comment card with image thumbnail
- Center: green pixel-stream connecting them
- Export as PNG at 1280x640
