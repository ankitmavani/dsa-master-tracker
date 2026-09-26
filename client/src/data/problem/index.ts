import dsa from "./dsa.json";
import sql from "./sql.json";

import type { ProblemRoadmap } from "@/types/problem";

export const problemData: Record<string, ProblemRoadmap> = {
  dsa,
  sql,
};

export type ProblemKey = keyof typeof problemData;
