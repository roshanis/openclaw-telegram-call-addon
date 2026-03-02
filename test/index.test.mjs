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
