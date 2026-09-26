import { useEffect, useMemo, useState } from "react";
import { problemData } from "@/data/problem";

import type { ProblemRoadmap, Question, QuestionStatus } from "@/types/problem";

const STORAGE_KEY = "learning-os-problem-data";

export function useProblem(roadmapId: string) {
  const [roadmaps, setRoadmaps] = useState<Record<string, ProblemRoadmap>>(
    () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : structuredClone(problemData);
    },
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
  }, [roadmaps]);

  const roadmap = useMemo(() => roadmaps[roadmapId], [roadmaps, roadmapId]);

  const completedDays = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days.filter(
      (day) =>
        day.questions.length > 0 &&
        day.questions.every((q) => q.status === "complete"),
    ).length;
  }, [roadmap]);

  const completedQuestions = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days
      .flatMap((d) => d.questions)
      .filter((q) => q.status === "complete").length;
  }, [roadmap]);

  const revisionQuestions = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days
      .flatMap((d) => d.questions)
      .filter((q) => q.status === "revision").length;
  }, [roadmap]);

  const totalQuestions = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days.reduce((acc, day) => acc + day.questions.length, 0);
  }, [roadmap]);

  const updateQuestionStatus = (questionId: number, status: QuestionStatus) => {
    setRoadmaps((prev) => ({
      ...prev,
      [roadmapId]: {
        ...prev[roadmapId],
        days: prev[roadmapId].days.map((day) => ({
          ...day,
          questions: day.questions.map((q) =>
            q.id === questionId ? { ...q, status } : q,
          ),
        })),
      },
    }));
  };

  const increaseRandomSolved = (questionId: number) => {
    setRoadmaps((prev) => ({
      ...prev,
      [roadmapId]: {
        ...prev[roadmapId],
        days: prev[roadmapId].days.map((day) => ({
          ...day,
          questions: day.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  randomSolvedCount: q.randomSolvedCount + 1,
                }
              : q,
          ),
        })),
      },
    }));
  };

  const getDay = (dayNumber: number) =>
    roadmap?.days.find((d) => d.day === dayNumber);

  const getAllQuestions = (): Question[] =>
    roadmap?.days.flatMap((d) => d.questions) ?? [];

  return {
    roadmap,

    completedDays,
    completedQuestions,
    revisionQuestions,
    totalQuestions,

    getDay,
    getAllQuestions,

    updateQuestionStatus,
    increaseRandomSolved,
  };
}
