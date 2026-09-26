export type QuestionStatus = "pending" | "complete" | "revision";

export type Platform = "leetcode" | "gfg";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: number;
  title: string;
  platform: Platform;
  difficulty: Difficulty;
  url: string;
  status: QuestionStatus;
  randomSolvedCount: number;
}

export interface ProblemDay {
  day: number;
  title: string;
  questions: Question[];
}

export interface ProblemRoadmap {
  id: string;
  title: string;
  type: "problem";
  days: ProblemDay[];
}
