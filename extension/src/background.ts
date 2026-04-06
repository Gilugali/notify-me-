import { fetchCanvasAssignments } from "./canvas.js";
import { getSettings, saveAssignments } from "./storage.js";

const ALARM = "check-assignments";

chrome.runtime.onInstalled.addListener(() => scheduleAlarm());
chrome.runtime.onStartup.addListener(() => scheduleAlarm());

chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === ALARM) refresh().catch(console.error);
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "refresh") {
    refresh()
      .then((n) => sendResponse({ ok: true, count: n }))
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }
  if (msg?.type === "reschedule") {
    scheduleAlarm().then(() => sendResponse({ ok: true }));
    return true;
  }
});

async function scheduleAlarm() {
  const { intervalMinutes } = await getSettings();
  await chrome.alarms.clear(ALARM);
  await chrome.alarms.create(ALARM, { periodInMinutes: intervalMinutes || 60 });
}

async function refresh(): Promise<number> {
  const { canvasHost } = await getSettings();
  if (!canvasHost) throw new Error("canvas host not configured");
  const items = await fetchCanvasAssignments(canvasHost);
  items.sort(byDue);
  await saveAssignments(items);
  return items.length;
}

function byDue(a: { dueAt: string | null }, b: { dueAt: string | null }) {
  if (!a.dueAt && !b.dueAt) return 0;
  if (!a.dueAt) return 1;
  if (!b.dueAt) return -1;
  return a.dueAt.localeCompare(b.dueAt);
}
