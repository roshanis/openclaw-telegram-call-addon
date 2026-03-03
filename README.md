# openclaw-telegram-call-addon

OpenClaw plugin that adds a `/call` Telegram command and forwards requests to your voice backend (`/call` HTTP endpoint, Pipecat-compatible).

This repo is the addon only. It does not include telephony/audio processing.

## Quick Start (OpenClaw)

1. Install plugin:
```bash
git clone https://github.com/roshanis/openclaw-telegram-call-addon.git
cd openclaw-telegram-call-addon
openclaw plugins install .
```

Or from npm:
```bash
openclaw plugins install @roshanis/openclaw-telegram-call-addon
```

2. Configure environment in your OpenClaw runtime (`~/.openclaw/.env` or your service env):
```bash
PIPECAT_CALL_URL=http://127.0.0.1:3334/call
PIPECAT_CALL_SECRET=replace_with_call_api_secret
PIPECAT_SOURCE_TOKEN=replace_with_telegram_call_token
PIPECAT_ALLOWED_NUMBERS=+15551234567,+15557654321
TWILIO_TO_NUMBER=+15551234567
```

3. Restart OpenClaw gateway.

4. Verify from Telegram:
- `/call help`
- `/call status`

## Commands

Core:
- `/call help`
- `/call <phone>`
- `/call me` (uses `TWILIO_TO_NUMBER`)
- `/call status`

Optional backend features:
- `/call speed <0.85-1.15>`
- `/call todo <task>`
- `/call board`

## Safety Behavior

- `/call` with no args shows help (no outbound call).
- `/call help` never places a call.
- Invalid numbers are rejected before backend call.
- If `PIPECAT_ALLOWED_NUMBERS` is set, non-allowlisted numbers are blocked.

## Required Backend Contract

Minimum endpoints expected:
- `POST /call`
- `GET /health/deep`

Optional endpoints used by extra commands:
- `POST /config/voice`
- `POST /kanban/add`
- `GET /kanban`

## Troubleshooting

- `/call` missing in Telegram command list:
  restart OpenClaw gateway after plugin install.
- `Call failed: invalid call secret`:
  check `PIPECAT_CALL_SECRET` value matches backend `CALL_API_SECRET`.
- `Call blocked ... not in PIPECAT_ALLOWED_NUMBERS`:
  add target in E.164 format.
- `/call me` says no default number:
  set `TWILIO_TO_NUMBER`.

## Compatibility

| OpenClaw Version | Addon Version | Status |
|---|---|---|
| 2026.2.x | 0.2.x | Tested |
| 2026.3.x | 0.2.x | Unknown |

## OpenClaw Listing

- Showcase PR: https://github.com/openclaw/openclaw/pull/32502

## Security

- Keep `PIPECAT_CALL_SECRET` and `PIPECAT_SOURCE_TOKEN` private.
- Use destination allowlists in both addon and backend.
- See [SECURITY.md](SECURITY.md) for reporting.
