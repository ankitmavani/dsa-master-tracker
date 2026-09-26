import nodejs from "./nodejs.json";
import react from "./react.json";
import systemDesign from "./system-design.json";

import type { LearningRoadmap } from "@/types/learning";

export const learningData: Record<string, LearningRoadmap> = {
  nodejs,
  react,
  "system-design": systemDesign,
};

export type LearningKey = keyof typeof learningData;
