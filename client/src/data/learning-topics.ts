import type { LearningTopic } from "@/types/learning";

export const learningTopics: LearningTopic[] = [
  {
    id: 1,
    roadmapId: "node",
    day: 1,
    title: "Event Loop",
    description: "Understand phases & execution",
    completed: false,
    revision: false,
  },
  {
    id: 2,
    roadmapId: "node",
    day: 1,
    title: "Call Stack",
    description: "Execution context",
    completed: true,
    revision: false,
  },
  {
    id: 3,
    roadmapId: "node",
    day: 1,
    title: "Microtask Queue",
    description: "Promise execution",
    completed: false,
    revision: true,
  },
];
