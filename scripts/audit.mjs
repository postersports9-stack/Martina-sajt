/**
 * Accessibility + layout audit over the DevTools Protocol.
 *
 * Checks the things this page can realistically regress on: missing alt text,
 * heading order, touch target size at 375px, horizontal overflow, images without
 * intrinsic dimensions (CLS), stuck reveal elements, and console errors.
 *
 * Usage: node scripts/audit.mjs [url]
 */

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9224;
const url = process.argv[2] ?? "http://localhost:3000/";

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "/lnv-audit",
  "about:blank",
]);

let nextId = 1;
const pending = new Map();
const consoleErrors = [];

function send(ws, method, params = {}, sessionId) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params, sessionId }));
  return new Promise((r) => pending.set(id, r));
}

const AUDIT = `(() => {
  const out = {};
  out.imagesMissingAlt = [...document.querySelectorAll('img')]
    .filter(i => i.getAttribute('alt') === null)
    .map(i => i.currentSrc || i.src);
  out.imagesMissingDims = [...document.querySelectorAll('img')]
    .filter(i => !i.getAttribute('width') || !i.getAttribute('height'))
    .map(i => i.currentSrc || i.src);
  out.headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .map(h => h.tagName + ' ' + h.textContent.trim().slice(0, 42));
  const h1s = document.querySelectorAll('h1');
  out.h1Count = h1s.length;
  let prev = 0, skips = [];
  [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].forEach(h => {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) skips.push(prev + '->' + lvl + ' ' + h.textContent.trim().slice(0,30));
    prev = lvl;
  });
  out.headingSkips = skips;
  out.smallTargets = [...document.querySelectorAll('a,button,[role=button]')]
    .filter(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      return r.width < 44 || r.height < 44;
    })
    .map(el => (el.textContent.trim().slice(0, 32) || el.getAttribute('aria-label') || el.tagName)
      + ' ' + Math.round(el.getBoundingClientRect().width) + 'x'
      + Math.round(el.getBoundingClientRect().height));
  out.overflow = document.documentElement.scrollWidth - window.innerWidth;
  out.stuckReveals = document.querySelectorAll('[data-reveal].is-armed:not(.is-visible)').length;
  out.langAttr = document.documentElement.lang;
  out.linksNoText = [...document.querySelectorAll('a')]
    .filter(a => !a.textContent.trim() && !a.getAttribute('aria-label')).length;
  out.telLinks = [...document.querySelectorAll('a[href^=tel]')].length;
  return JSON.stringify(out, null, 1);
})()`;

try {
  let version;
  for (let i = 0; i < 40; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      break;
    } catch {
      await sleep(250);
    }
  }
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m.result);
      pending.delete(m.id);
    }
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
      consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
    }
    if (m.method === "Runtime.exceptionThrown") {
      consoleErrors.push(m.params.exceptionDetails.text +
        " " + (m.params.exceptionDetails.exception?.description ?? ""));
    }
  };

  const { targetId } = await send(ws, "Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send(ws, "Target.attachToTarget", { targetId, flatten: true });
  await send(ws, "Page.enable", {}, sessionId);
  await send(ws, "Runtime.enable", {}, sessionId);

  for (const [w, h] of [[375, 812], [1440, 900]]) {
    await send(ws, "Emulation.setDeviceMetricsOverride",
      { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 }, sessionId);
    await send(ws, "Page.navigate", { url }, sessionId);
    await sleep(2500);
    const res = await send(ws, "Runtime.evaluate",
      { expression: AUDIT, returnByValue: true }, sessionId);
    console.log(`\n===== ${w}x${h} =====`);
    console.log(res.result.value);
  }

  console.log("\n===== console errors =====");
  console.log(consoleErrors.length ? consoleErrors.join("\n") : "none");
  ws.close();
} finally {
  chrome.kill();
}
