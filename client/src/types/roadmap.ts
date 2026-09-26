export type RoadmapType = "problem" | "learning";

export type RoadmapColor = "yellow" | "green" | "blue" | "pink";

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
