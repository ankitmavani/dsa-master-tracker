export type RoadmapType = "problem" | "learning";

export interface Roadmap {
  id: string;
  title: string;
  description: string;

  type: RoadmapType;

  totalDays: number;

  color: string;
  icon?: string;

  createdAt: Date;
}
