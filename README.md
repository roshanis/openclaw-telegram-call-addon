# openclaw-telegram-call-addon

Telegram command addon for OpenClaw that registers `/call` and forwards actions to a Pipecat-compatible HTTP backend.

This addon only depends on OpenClaw's command registration API. The voice backend is separate and optional.

## What Users Need
- `/call <phone>` to place a call
- `/call me` to call your configured default number
- `/call status` to check backend health

## Commands
- `/call help`
- `/call <phone>`
- `/call status`
- `/call speed <0.85-1.15>`
- `/call todo <task>`
- `/call board`

## Install
```bash
git clone https://github.com/roshanis/openclaw-telegram-call-addon.git
cd openclaw-telegram-call-addon
openclaw plugins install .
```

## Configuration
Copy `.env.example` values into your OpenClaw environment.

Minimum:
- `PIPECAT_CALL_URL` (defaults to `http://127.0.0.1:3334/call`)

Recommended:
- `PIPECAT_CALL_SECRET`
- `PIPECAT_SOURCE_TOKEN`
- `PIPECAT_ALLOWED_NUMBERS` (comma-separated E.164)
- `TWILIO_TO_NUMBER` (used by `/call me`)

## Safety Defaults
- `/call` with no arguments always shows help (it does not auto-call).
- `/call help` never places a call.
- Invalid numbers are rejected before calling the backend.

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
