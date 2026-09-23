export const dsaRoadmap = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  day: i + 1,
  topic: [
    "Arrays",
    "Strings",
    "HashMap",
    "Stack",
    "Queue",
    "Linked List",
    "Tree",
    "Graph",
    "Heap",
    "DP",
  ][i % 10],
  totalQuestions: 3,
  completed: i < 19,
  revision: i % 7 === 0,
}));
