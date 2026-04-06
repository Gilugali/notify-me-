import { Assignment } from "./types.js";

type CanvasCourse = { id: number; name: string };
type CanvasAssignment = {
  id: number;
  name: string;
  due_at: string | null;
  html_url: string;
};

export async function fetchCanvasAssignments(host: string): Promise<Assignment[]> {
  const base = `https://${host}/api/v1`;
  const courses = await getJson<CanvasCourse[]>(
    `${base}/courses?enrollment_state=active&per_page=100`
  );

  const results: Assignment[] = [];
  for (const c of courses) {
    const items = await getJson<CanvasAssignment[]>(
      `${base}/courses/${c.id}/assignments?per_page=100&order_by=due_at`
    );
    for (const a of items) {
      results.push({
        id: `canvas-${c.id}-${a.id}`,
        course: c.name,
        title: a.name,
        dueAt: a.due_at,
        url: a.html_url,
      });
    }
  }
  return results;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}
