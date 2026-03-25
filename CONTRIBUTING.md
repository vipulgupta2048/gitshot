# Contributing to gitshot

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/vipulgupta2048/gitshot.git
cd gitshot

# Install dev dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js screenshot.png
```

**Requirements:** Node.js 22+, npm 10+

## Making Changes

1. Fork the repo and create a branch from `main`
2. Make your changes in `src/`
3. Run `npm run build` to verify TypeScript compilation
4. Test manually with a real image file
5. Commit with a clear message describing the change

## Code Style

- TypeScript strict mode is enabled
- Zero runtime dependencies — use Node.js built-ins only
- All user-facing output goes to `stdout` (URLs/markdown only)
- All logs and progress go to `stderr`
- No interactive prompts — the CLI must be fully non-interactive

## Adding a New Backend

1. Create `src/yourbackend.ts` implementing the `Uploader` interface from `src/upload.ts`
2. Add the backend name to the `BackendName` type in `src/upload.ts`
3. Add detection logic in `detectBackend()` in `src/index.ts`
4. Update the help text and README
5. Test with a real image upload

## Pull Request Process

- Keep PRs focused — one feature or fix per PR
- Update the README if you're adding user-facing changes
- Make sure `npm run build` passes cleanly
- Describe what you changed and why in the PR description

## Reporting Issues

Use the [issue templates](https://github.com/vipulgupta2048/gitshot/issues/new/choose) — they help us diagnose problems faster.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
