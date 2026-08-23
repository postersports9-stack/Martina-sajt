/**
 * Screenshot helper driving Chrome over the DevTools Protocol.
 *
 * Chrome's `--screenshot` CLI flag does not reliably apply `--window-size` to the
 * *layout* viewport, which silently produces false responsive results (a page laid
 * out at ~800px but cropped to 375px looks like a horizontal-overflow bug).
 * Emulation.setDeviceMetricsOverride sets the real layout viewport, so media queries
 * evaluate at the width being tested.
 *
 * Usage: node scripts/shoot.mjs <url> <outDir> [width]x[height] ...
 */

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;

const url = process.argv[2] ?? "http://localhost:3000/";
const outDir = process.argv[3] ?? "shots";
const sizes = (process.argv.slice(4).length ? process.argv.slice(4) : ["375x812", "768x1024", "1440x900"]).map(
  (s) => {
    const [w, h] = s.split("x").map(Number);
    return { w, h };
  }
);

mkdirSync(outDir, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + outDir + "/.chrome-cdp",
  "about:blank",
]);

let nextId = 1;
const pending = new Map();

function send(ws, method, params = {}, sessionId) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params, sessionId }));
  return new Promise((resolve) => pending.set(id, resolve));
}

try {
  // Wait for the debugging endpoint to come up.
  let targets;
  for (let i = 0; i < 40; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      break;
    } catch {
      await sleep(250);
    }
  }
  if (!targets) throw new Error("Chrome DevTools endpoint never came up");

  const ws = new WebSocket(targets.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  const { targetId } = await send(ws, "Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send(ws, "Target.attachToTarget", { targetId, flatten: true });

  await send(ws, "Page.enable", {}, sessionId);
  await send(ws, "Runtime.enable", {}, sessionId);

  for (const { w, h } of sizes) {
    await send(
      ws,
      "Emulation.setDeviceMetricsOverride",
      { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 },
      sessionId
    );
    await send(ws, "Page.navigate", { url }, sessionId);
    await sleep(2500);

    // Scroll to the bottom and back so IntersectionObserver reveals fire, then settle.
    await send(
      ws,
      "Runtime.evaluate",
      { expression: "window.scrollTo(0, document.body.scrollHeight); " },
      sessionId
    );
    await sleep(1200);
    await send(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" }, sessionId);
    await sleep(600);

    const probe = await send(
      ws,
      "Runtime.evaluate",
      {
        expression: `JSON.stringify({
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          hiddenReveals: document.querySelectorAll('[data-reveal].is-armed:not(.is-visible)').length,
          widest: (() => {
            let worst = null, max = 0;
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > max) { max = r.right; worst = el.tagName + '.' + (el.className.toString().slice(0,60)); }
            });
            return { max: Math.round(max), el: worst };
          })()
        })`,
        returnByValue: true,
      },
      sessionId
    );
    console.log(`${w}x${h} ->`, probe.result.value);

    // Full page. Note: `captureBeyondViewport` can mispaint position:fixed elements,
    // so the sticky header is verified separately with a viewport-only capture.
    const shot = await send(
      ws,
      "Page.captureScreenshot",
      { format: "png", captureBeyondViewport: true },
      sessionId
    );
    writeFileSync(`${outDir}/shot-${w}.png`, Buffer.from(shot.data, "base64"));

    const vp = await send(ws, "Page.captureScreenshot", { format: "png" }, sessionId);
    writeFileSync(`${outDir}/viewport-${w}.png`, Buffer.from(vp.data, "base64"));
  }

  ws.close();
} finally {
  chrome.kill();
}
