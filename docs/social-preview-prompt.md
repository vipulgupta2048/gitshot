# Social Preview Image — Gemini Prompt

Use this prompt in Google Gemini (or any image generation AI) to create the GitHub social preview image.

## Prompt

```
Create a social media preview image (1280x640 pixels) for a developer CLI tool called "gitshot".

Design requirements:
- Dark background using the Catppuccin Mocha color palette (base: #1e1e2e)
- The word "gitshot" in large, bold, monospace font (like JetBrains Mono or Fira Code) in white/light lavender (#cdd6f4), centered in the upper third
- Below the name, a subtle tagline in smaller text: "Images in GitHub, straight from your terminal." in surface2 color (#585b70)
- In the center, show a minimal terminal window mockup with this command and output:
  $ npx gitshot bug.png
  ![bug](https://github.com/.../bug-a3f2.png)
  Using release backend
- Terminal window should have a dark surface (#313244) background with rounded corners and the classic three dots (red/yellow/green) in the top-left
- The command text should be in green (#a6e3a1), the output in white (#cdd6f4), the status line in dim (#585b70)
- Bottom-right corner: a small GitHub icon and "MIT License" in muted text (#585b70)
- No gradients, no 3D effects, no stock photos. Clean, flat, developer-aesthetic.
- The overall feel should be like a Charm.sh or Vercel product card — minimal, confident, dark.

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
- JetBrains Mono font
- Terminal mockup with the command shown above
- Export as PNG at 1280x640
