export type RoadmapType = "problem" | "learning";

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  type: RoadmapType;
  totalDays: number;
  color: "yellow" | "green" | "blue" | "pink";
  file: string;
}
