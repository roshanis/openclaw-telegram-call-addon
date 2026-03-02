# Changelog

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
