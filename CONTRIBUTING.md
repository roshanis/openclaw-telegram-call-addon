# Contributing

Thanks for your interest in contributing.

## Getting Started

1. Fork this repository.
2. Create a feature branch from `main`.
3. Make your changes.
4. Run tests: `node --test test/index.test.mjs`
5. Open a pull request.

## Guidelines

- Keep changes focused — one feature or fix per PR.
- Add tests for new behavior.
- Do not commit `.env` files, API keys, tokens, or phone numbers.
- Follow the existing code style (no build step, plain ESM).
- Keep command behavior safe by default (no implicit outbound calls).

## Reporting Issues

Use GitHub Issues. Include your OpenClaw version and Node.js version.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.
