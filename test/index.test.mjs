import test from "node:test";
import assert from "node:assert/strict";

import register from "../index.js";

test("registers /call command", async () => {
  const commands = {};
  register({
    version: "2026.2.26",
    registerCommand: (cmd) => {
      commands[cmd.name] = cmd;
    },
  });
  assert.ok(commands.call);
  assert.equal(typeof commands.call.handler, "function");
});

test("blocks non-allowlisted number", async () => {
  const prevAllowed = process.env.PIPECAT_ALLOWED_NUMBERS;
  process.env.PIPECAT_ALLOWED_NUMBERS = "+15551234567";

  const commands = {};
  register({
    registerCommand: (cmd) => {
      commands[cmd.name] = cmd;
    },
  });

  const out = await commands.call.handler({ args: "+15557654321" });
  assert.match(out.text, /Call blocked:/);

  if (prevAllowed === undefined) {
    delete process.env.PIPECAT_ALLOWED_NUMBERS;
  } else {
    process.env.PIPECAT_ALLOWED_NUMBERS = prevAllowed;
  }
});

test("help does not place an outbound call", async () => {
  const prevDefault = process.env.TWILIO_TO_NUMBER;
  process.env.TWILIO_TO_NUMBER = "+15551234567";

  const commands = {};
  register({
    registerCommand: (cmd) => {
      commands[cmd.name] = cmd;
    },
  });

  const prevFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return { ok: true, json: async () => ({}) };
  };

  const out = await commands.call.handler({ args: "help" });
  assert.match(out.text, /Usage:/);
  assert.equal(called, false);

  globalThis.fetch = prevFetch;
  if (prevDefault === undefined) {
    delete process.env.TWILIO_TO_NUMBER;
  } else {
    process.env.TWILIO_TO_NUMBER = prevDefault;
  }
});

test("invalid number does not fall back to default", async () => {
  const prevDefault = process.env.TWILIO_TO_NUMBER;
  process.env.TWILIO_TO_NUMBER = "+15551234567";

  const commands = {};
  register({
    registerCommand: (cmd) => {
      commands[cmd.name] = cmd;
    },
  });

  const prevFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return { ok: true, json: async () => ({}) };
  };

  const out = await commands.call.handler({ args: "not-a-number" });
  assert.match(out.text, /Invalid phone number/);
  assert.equal(called, false);

  globalThis.fetch = prevFetch;
  if (prevDefault === undefined) {
    delete process.env.TWILIO_TO_NUMBER;
  } else {
    process.env.TWILIO_TO_NUMBER = prevDefault;
  }
});
