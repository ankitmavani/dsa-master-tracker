export interface Question {
  id: string;

  roadmapId: string;
  dayId: string;
  day: number;

  title: string;
  description: string;

  leetcodeUrl: string;
  gfgUrl: string;

  difficulty: "Easy" | "Medium" | "Hard";

  tags: string[];

  notes: string;

  status: "pending" | "complete" | "revision";

  createdAt: Date;
}
