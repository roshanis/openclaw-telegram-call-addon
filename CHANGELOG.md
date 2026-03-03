# Changelog

## 0.2.2 - 2026-03-03

### Changed
- Switched npm package name to `@roshanis/openclaw-telegram-call-addon` for unique publish scope.
- Added npm install path in README for direct `openclaw plugins install` usage.
- Added OpenClaw showcase PR link in README.

### Compatibility
- OpenClaw `2026.2.x`: tested.
- OpenClaw `2026.3.x`: untested.

## 0.2.1 - 2026-03-02

### Added
- `CONTRIBUTING.md` with contributor workflow and test command.
- Cleaner OpenClaw-first README quickstart and troubleshooting.

### Changed
- `/call` behavior remains explicit and safe:
  - `/call` with no args shows help.
  - `/call help` never places outbound calls.
  - Invalid numbers are rejected and do not fall back to defaults.
- Improved repository hygiene in `.gitignore` (`.env.*` ignored, `.env.example` tracked).

### Removed
- Removed empty `package-lock.json` (no runtime dependencies to lock).

### Compatibility
- OpenClaw `2026.2.x`: tested.
- OpenClaw `2026.3.x`: untested.
