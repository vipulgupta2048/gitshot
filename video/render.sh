#!/bin/bash
set -e

echo "Rendering gitshot launch video..."
mkdir -p out

# Twitter/X (landscape)
echo "→ Twitter (1280x720)..."
npx remotion render GitshotDemo out/gitshot-twitter.mp4 \
  --width 1280 --height 720 --crf 18

# YouTube (full HD)
echo "→ YouTube (1920x1080)..."
npx remotion render GitshotDemo out/gitshot-youtube.mp4 \
  --width 1920 --height 1080 --crf 18

# Product Hunt (square)
echo "→ Product Hunt (1080x1080)..."
npx remotion render GitshotDemo out/gitshot-producthunt.mp4 \
  --width 1080 --height 1080 --crf 18

# Instagram Reels (vertical)
echo "→ Reels (1080x1920)..."
npx remotion render GitshotDemo out/gitshot-reels.mp4 \
  --width 1080 --height 1920 --crf 18

echo "Done! Videos in out/"
ls -lh out/
