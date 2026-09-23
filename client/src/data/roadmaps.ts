import type { Roadmap } from "@/types/roadmaps";

export const roadmaps: Roadmap[] = [
  {
    id: "dsa",
    title: "DSA Master",
    description: "",
    type: "problem",
    totalDays: 60,
    color: "yellow",
    file: "dsa",
  },
  {
    id: "sql",
    title: "SQL Master",
    description: "",
    type: "problem",
    totalDays: 30,
    color: "blue",
    file: "sql",
  },
  {
    id: "nodejs",
    title: "Node.js",
    type: "learning",
    description: "",
    totalDays: 30,
    color: "green",
    file: "nodejs",
  },
];
