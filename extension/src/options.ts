import { getSettings, saveSettings } from "./storage.js";
import { Settings } from "./types.js";

const form = document.getElementById("form") as HTMLFormElement;
const status = document.getElementById("status") as HTMLDivElement;

async function load() {
  const s = await getSettings();
  (Object.keys(s) as (keyof Settings)[]).forEach((k) => {
    const el = form.elements.namedItem(k) as HTMLInputElement | null;
    if (el) el.value = String(s[k]);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const s: Settings = {
    canvasHost: String(fd.get("canvasHost") ?? ""),
    intervalMinutes: Number(fd.get("intervalMinutes") ?? 60),
  };
  await saveSettings(s);
  await chrome.runtime.sendMessage({ type: "reschedule" });
  status.textContent = "Saved.";
  setTimeout(() => (status.textContent = ""), 1500);
});

load();
