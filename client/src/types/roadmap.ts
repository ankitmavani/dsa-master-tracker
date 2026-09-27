export type RoadmapType = "problem" | "learning";

export type RoadmapColor = "yellow" | "green" | "blue" | "pink";

interface Playlist {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  channel: string;
}

interface Book {
  id: string;
  title: string;
  url: string;
  cover: string;
  author: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  links: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  type: RoadmapType;
  totalDays: number;
  completedDays: number;
  progress: number;
  color: RoadmapColor;
  icon?: string;

  youtubePlaylists: Playlist[];
  books: Book[];
  notes: Note[];
}

export interface DashboardStats {
  totalRoadmaps: number;
  totalDays: number;
  completedDays: number;
}

export interface RoadmapResponse {
  stats: DashboardStats;
  roadmaps: Roadmap[];
}
