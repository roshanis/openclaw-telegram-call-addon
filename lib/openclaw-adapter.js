export function registerCallCommand(api, handler) {
  if (!api || typeof api.registerCommand !== "function") {
    throw new Error("OpenClaw API mismatch: registerCommand() is unavailable.");
  }

  const runtimeVersion =
    api.version || api.openclawVersion || process.env.OPENCLAW_VERSION || "unknown";
  const expectedPrefix = "2026.2";
  if (runtimeVersion !== "unknown" && !String(runtimeVersion).startsWith(expectedPrefix)) {
    // Keep startup non-fatal but surface potential incompatibility.
    // eslint-disable-next-line no-console
    console.warn(
      `[telegram-call] OpenClaw version ${runtimeVersion} is outside tested range ${expectedPrefix}.x`,
    );
  }

  api.registerCommand({
    name: "call",
    description: "Place a Pipecat phone call via local /call endpoint.",
    acceptsArgs: true,
    handler,
  });
}
