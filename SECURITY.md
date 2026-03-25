# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you find a security vulnerability in gitshot, **please do not open a public issue.**

Instead, email **vipulgupta2048@gmail.com** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

You should receive a response within 48 hours. We'll work with you to understand the issue and coordinate a fix before any public disclosure.

## Security Considerations

- **GitHub tokens**: gitshot uses `gh` CLI's authentication. It never stores or transmits tokens directly. The `GITHUB_TOKEN` environment variable is an alternative for CI environments.
- **Image hosting**: Images uploaded via the `release` backend are hosted in a public GitHub repository. Do not upload images containing sensitive information.
- **Third-party backends**: Catbox.moe, Cloudinary, and imgbb are external services with their own privacy policies. Review their terms before uploading sensitive content.
- **No telemetry**: gitshot does not collect any analytics, telemetry, or usage data.
