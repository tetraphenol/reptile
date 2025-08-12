export interface Settings {
  openaiApiKey?: string;
}

export interface Project {
  id: string | null; // null until first save
  name: string;
  content: string;
  updatedAt: string; // ISO
}