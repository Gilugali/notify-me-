import { getAssignments, getUpdatedAt } from "./storage.js";
import { Assignment } from "./types.js";

const list = document.getElementById("list") as HTMLDivElement;
const status = document.getElementById("status") as HTMLDivElement;
const btn = document.getElementById("refresh") as HTMLButtonElement;

btn.addEventListener("click", async () => {
  btn.disabled = true;
  status.textContent = "Refreshing…";
  const res = await chrome.runtime.sendMessage({ type: "refresh" });
  if (res?.ok) {
    await render();
  } else {
    status.textContent = `Error: ${res?.error ?? "unknown"}`;
  }
  btn.disabled = false;
});

async function render() {
  const items = await getAssignments();
  const updated = await getUpdatedAt();
  status.textContent = updated
    ? `Updated ${new Date(updated).toLocaleString()}`
    : "Never refreshed.";

  if (!items.length) {
    list.innerHTML = `<div class="empty">No assignments.</div>`;
    return;
  }
  list.innerHTML = items.map(row).join("");
}

function row(a: Assignment): string {
  const due = a.dueAt ? formatDue(a.dueAt) : "no due date";
  return `
    <a class="item" href="${a.url}" target="_blank" rel="noreferrer">
      <div class="title">${escape(a.title)}</div>
      <div class="meta">${escape(a.course)} — ${due}</div>
    </a>`;
}

function formatDue(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const days = Math.round((d.getTime() - now.getTime()) / 86400000);
  const abs = d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  if (days < 0) return `${abs} (overdue)`;
  if (days === 0) return `${abs} (today)`;
  if (days === 1) return `${abs} (tomorrow)`;
  return `${abs} (in ${days}d)`;
}

function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!)
  );
}

render();
