# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.0.1] - 2026-03-24

### Added

- Initial release
- Upload images to GitHub via 4 backends: GitHub Releases, Catbox.moe, Cloudinary, imgbb
- Smart auto-detection of available backends
- Markdown output (default), raw URL (`--raw`), and JSON (`--json`) output modes
- GitHub Release backend auto-creates `<user>/gitshot-images` repo on first use
- Catbox.moe fallback with 3 retries and exponential backoff
- Cloudinary signed uploads with SHA1
- imgbb base64 uploads
- Support for PNG, JPG, JPEG, GIF, SVG, WebP, BMP, ICO, TIFF, AVIF
- `gh-shot` wrapper for GitHub CLI extension usage
- Agent skill (SKILL.md) for Claude Code, Cursor, Copilot, and other AI agents
- Composable design: pipe output directly to `gh issue create`, `gh pr comment`, etc.
