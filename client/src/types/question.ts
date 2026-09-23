export type QuestionStatus = "pending" | "complete" | "revision";

export interface Question {
  id: number;

  roadmapId: string;

  day: number;

  title: string;

  platform: "LeetCode" | "GFG";

  difficulty: "Easy" | "Medium" | "Hard";

  status: QuestionStatus;

  url: string;

  randomSolvedCount: number;
}
