import { registerCallCommand } from "./lib/openclaw-adapter.js";

const DEFAULT_CALL_URL = process.env.PIPECAT_CALL_URL || "http://127.0.0.1:3334/call";
const CALL_SECRET = process.env.PIPECAT_CALL_SECRET || "";
const SOURCE_TOKEN = process.env.PIPECAT_SOURCE_TOKEN || "";

function normalizePhone(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("+")) {
    const digits = trimmed.slice(1).replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 15) {
      return `+${digits}`;
    }
    return null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function allowedNumbers() {
  return new Set(
    (process.env.PIPECAT_ALLOWED_NUMBERS || "")
      .split(",")
      .map((v) => normalizePhone(v))
      .filter(Boolean),
  );
}

function usage(defaultTo) {
  const defaultLine = defaultTo
    ? `\nDefault recipient: ${defaultTo} (used when no number is provided).`
    : "";
  return [
    "Usage:",
    "/call <phone>",
    "/call call <phone>",
    "/call me",
    "/call status",
    "/call speed <0.85-1.15>",
    "/call todo <task>",
    "/call board",
    "",
    "Examples:",
    "/call +15551234567",
    "/call call 5551234567",
    defaultLine,
  ]
    .join("\n")
    .trim();
}

async function healthStatus() {
  const res = await fetch(DEFAULT_CALL_URL.replace(/\/call$/, "/health/deep"));
  if (!res.ok) {
    return `Health check failed: HTTP ${res.status}`;
  }
  const data = await res.json().catch(() => ({}));
  const status = data?.status || "unknown";
  const mode = data?.audioMode || "unknown";
  const voice = data?.voice?.name || "unknown";
  const speed = data?.voice?.speed || "unknown";
  const sig = data?.signatureValidation ? "on" : "off";
  const hasSecret = data?.callApiSecretSet ? "yes" : "no";
  const twilioOk = data?.twilio?.matchesExpected === true ? "yes" : "no";
  const allowedSource = data?.callPolicy?.allowedSource || "any";
  const allowlistCount = Number(data?.callPolicy?.allowlistCount || 0);
  const kanbanPath = data?.kanban?.path || "(unknown)";
  return [
    `Pipecat status: ${status}`,
    `Audio mode: ${mode}`,
    `Voice: ${voice} @ speed ${speed}`,
    `Signature validation: ${sig}`,
    `Call secret configured: ${hasSecret}`,
    `Allowed source: ${allowedSource}`,
    `Allowlist size: ${allowlistCount}`,
    `Kanban path: ${kanbanPath}`,
    `Twilio webhook matches: ${twilioOk}`,
  ].join("\n");
}

function buildHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (CALL_SECRET) headers["X-Call-Secret"] = CALL_SECRET;
  if (SOURCE_TOKEN) headers["X-Call-Source-Token"] = SOURCE_TOKEN;
  return headers;
}

async function updateSpeed(speed) {
  const res = await fetch(DEFAULT_CALL_URL.replace(/\/call$/, "/config/voice"), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ speed }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : `HTTP ${res.status}`;
    return `Speed update failed: ${detail}`;
  }
  return `Voice speed updated to ${data?.speed || speed}. New calls will use this speed.`;
}

async function addKanbanTask(title) {
  const res = await fetch(DEFAULT_CALL_URL.replace(/\/call$/, "/kanban/add"), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ source: "telegram", title }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : `HTTP ${res.status}`;
    return `Kanban add failed: ${detail}`;
  }
  return `Kanban updated: ${data?.result || "ok"}`;
}

async function readKanbanBoard() {
  const res = await fetch(DEFAULT_CALL_URL.replace(/\/call$/, "/kanban"), {
    method: "GET",
    headers: buildHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : `HTTP ${res.status}`;
    return `Board read failed: ${detail}`;
  }
  return data?.summary || "Board is empty.";
}

export default function register(api) {
  registerCallCommand(api, async (ctx) => {
      const argsRaw = (ctx.args || "").trim();
      const defaultTo = normalizePhone(process.env.TWILIO_TO_NUMBER || "");
      const tokens = argsRaw.split(/\s+/).filter(Boolean);
      if (tokens.length === 0 || tokens[0].toLowerCase() === "help") {
        if (!defaultTo) return { text: usage(defaultTo) };
      }

      let i = 0;
      const first = (tokens[i] || "").toLowerCase();
      if (first === "status") {
        try {
          return { text: await healthStatus() };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return { text: `Status failed: ${msg}` };
        }
      }
      if (first === "speed") {
        const next = tokens[i + 1];
        if (!next) {
          try {
            return { text: await healthStatus() };
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return { text: `Speed check failed: ${msg}` };
          }
        }
        const speed = Number(next);
        if (!Number.isFinite(speed) || speed < 0.85 || speed > 1.15) {
          return { text: "Usage: /call speed <0.85-1.15>" };
        }
        try {
          return { text: await updateSpeed(Number(speed).toFixed(2)) };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return { text: `Speed update failed: ${msg}` };
        }
      }
      if (first === "todo") {
        const title = tokens.slice(i + 1).join(" ").trim();
        if (!title) return { text: "Usage: /call todo <task>" };
        try {
          return { text: await addKanbanTask(title) };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return { text: `Kanban add failed: ${msg}` };
        }
      }
      if (first === "board" || first === "kanban") {
        try {
          return { text: await readKanbanBoard() };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return { text: `Board read failed: ${msg}` };
        }
      }
      if (first === "call" || first === "dial") i += 1;

      let to = null;
      if (tokens[i] && tokens[i].toLowerCase() === "me") {
        to = defaultTo;
        i += 1;
      } else if (tokens[i]) {
        to = normalizePhone(tokens[i]);
        if (to) i += 1;
      }

      if (!to) to = defaultTo;
      if (!to) return { text: usage(defaultTo) };
      const allowlist = allowedNumbers();
      if (allowlist.size > 0 && !allowlist.has(to)) {
        return { text: `Call blocked: ${to} is not in PIPECAT_ALLOWED_NUMBERS.` };
      }

      try {
        const res = await fetch(DEFAULT_CALL_URL, {
          method: "POST",
          headers: buildHeaders(),
          body: JSON.stringify({ to, source: "telegram" }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const detail = typeof data?.detail === "string" ? data.detail : `HTTP ${res.status}`;
          return { text: `Call failed: ${detail}` };
        }

        const callSid = typeof data?.callSid === "string" ? data.callSid : "(unknown)";
        return { text: `Calling ${to}\nCall SID: ${callSid}` };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { text: `Call failed: ${msg}` };
      }
  });
}
