import { useMemo } from "react";
import { roadmaps } from "@/data/roadmaps";
import { days } from "@/data/days";
import { questions } from "@/data/questions";

export function useRoadmap(roadmapId: string) {
  const roadmap = useMemo(
    () => roadmaps.find((r) => r.id === roadmapId),
    [roadmapId],
  );

  const roadmapDays = useMemo(
    () =>
      days
        .filter((d) => d.roadmapId === roadmapId)
        .sort((a, b) => a.day - b.day),
    [roadmapId],
  );

  const roadmapQuestions = useMemo(
    () => questions.filter((q) => q.roadmapId === roadmapId),
    [roadmapId],
  );

  const completedQuestions = roadmapQuestions.filter(
    (q) => q.status === "complete",
  ).length;

  const revisionQuestions = roadmapQuestions.filter(
    (q) => q.status === "revision",
  ).length;

  const completedDays = roadmapDays.filter((day) => {
    const list = roadmapQuestions.filter((q) => q.day === day.day);

    return list.length > 0 && list.every((q) => q.status === "complete");
  }).length;

  return {
    roadmap,
    roadmapDays,
    roadmapQuestions,
    completedQuestions,
    revisionQuestions,
    completedDays,
  };
}
