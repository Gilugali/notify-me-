export type Assignment = {
  id: string;
  course: string;
  title: string;
  dueAt: string | null;
  url: string;
};

export type Settings = {
  canvasHost: string;
  intervalMinutes: number;
};

export const defaultSettings: Settings = {
  canvasHost: "",
  intervalMinutes: 60,
};
