export type TopicStatus = "pending" | "complete";

export interface LearningDay {
  roadmapId: string;
  day: number;
  title: string;
}

export interface LearningTopic {
  id: number;
  roadmapId: string;
  day: number;
  title: string;
  description: string;
  completed: boolean;
  revision: boolean;
}
