import { Assignment, Settings, defaultSettings } from "./types.js";

export async function getSettings(): Promise<Settings> {
  const data = await chrome.storage.sync.get(defaultSettings);
  return data as Settings;
}

export async function saveSettings(s: Settings): Promise<void> {
  await chrome.storage.sync.set(s);
}

export async function getAssignments(): Promise<Assignment[]> {
  const { assignments = [] } = await chrome.storage.local.get("assignments");
  return assignments as Assignment[];
}

export async function saveAssignments(items: Assignment[]): Promise<void> {
  await chrome.storage.local.set({ assignments: items, updatedAt: Date.now() });
}

export async function getUpdatedAt(): Promise<number | null> {
  const { updatedAt = null } = await chrome.storage.local.get("updatedAt");
  return updatedAt;
}
