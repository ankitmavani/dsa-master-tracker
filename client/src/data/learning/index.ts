import nodejs from "./nodejs.json";
import react from "./react.json";
import systemDesign from "./system-design.json";

export const learningData = {
  nodejs,
  react,
  "system-design": systemDesign,
} as const;

export type LearningKey = keyof typeof learningData;
