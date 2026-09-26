export interface LearningTopic {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  revision: boolean;
}

export interface LearningDay {
  day: number;
  title: string;
  topics: LearningTopic[];
}

export interface LearningRoadmap {
  id: string;
  title: string;
  type: "learning";
  days: LearningDay[];
}
