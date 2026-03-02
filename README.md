# openclaw-telegram-call-addon

Telegram command addon for OpenClaw that registers `/call` and forwards actions to a Pipecat-compatible HTTP backend.

This addon only depends on OpenClaw's command registration API. The voice backend is separate and optional.

## Commands
- `/call <phone>`
- `/call status`
- `/call speed <0.85-1.15>`
- `/call todo <task>`
- `/call board`

## Required Environment
- `PIPECAT_CALL_URL` (example: `http://127.0.0.1:3334/call`)
- `PIPECAT_CALL_SECRET`
- `PIPECAT_SOURCE_TOKEN`
- `PIPECAT_ALLOWED_NUMBERS` (comma-separated E.164)

## Install (local path)
```bash
openclaw plugins install .
```

## Tested Compatibility
| OpenClaw Version | Addon Version | Status |
|---|---|---|
| 2026.2.x | 0.2.x | Tested |
| 2026.3.x | 0.2.x | Unknown |

## Security Notes
- Keep `PIPECAT_CALL_SECRET` and `PIPECAT_SOURCE_TOKEN` private.
- Use allowlists (`PIPECAT_ALLOWED_NUMBERS`) to prevent unauthorized dialing.

## OpenClaw API Surface
- `register(api)` default export
- `api.registerCommand({ name, acceptsArgs, handler })`

The addon isolates OpenClaw-facing calls in `lib/openclaw-adapter.js` for easier upgrades.
