import dsa from "./dsa.json";
import sql from "./sql.json";

export const problemData = {
  dsa,
  sql,
} as const;

export type ProblemKey = keyof typeof problemData;
