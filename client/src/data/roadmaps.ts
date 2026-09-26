import type { RoadmapCard } from "@/types/roadmap";

export const roadmaps: RoadmapCard[] = [
  {
    id: "dsa",
    title: "DSA Master",
    description: "100 Days LeetCode Journey",
    totalDays: 100,
    color: "yellow",
    type: "problem",
  },
  {
    id: "sql",
    title: "SQL Master",
    description: "100 Days SQL Practice",
    totalDays: 100,
    color: "blue",
    type: "problem",
  },
  {
    id: "nodejs",
    title: "Node.js Mastery",
    description: "Backend Learning Roadmap",
    totalDays: 60,
    color: "green",
    type: "learning",
  },
  {
    id: "react",
    title: "React Mastery",
    description: "Frontend Learning Roadmap",
    totalDays: 45,
    color: "pink",
    type: "learning",
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Scalable Architecture",
    totalDays: 60,
    color: "green",
    type: "learning",
  },
];
