import { useMemo, useState } from "react";
import { problemData } from "@/data/problem";

export function useProblem(roadmapId: string) {
  const [data, setData] = useState(() => {
    return structuredClone(problemData[roadmapId as keyof typeof problemData]);
  });

  const completedDays = useMemo(() => {
    return data.days.filter((day) =>
      day.questions.every((q) => q.status === "complete"),
    ).length;
  }, [data]);

  const updateQuestionStatus = (
    questionId: number,
    status: "complete" | "revision" | "pending",
  ) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => ({
        ...day,
        questions: day.questions.map((q) =>
          q.id === questionId ? { ...q, status } : q,
        ),
      })),
    }));
  };

  return {
    roadmap: data,
    completedDays,
    updateQuestionStatus,
  };
}
