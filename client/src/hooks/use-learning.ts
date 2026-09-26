import { useEffect, useMemo, useState } from "react";
import { learningData } from "@/data/learning";

import type { LearningRoadmap } from "@/types/learning";

const STORAGE_KEY = "learning-os-learning-data";

export function useLearning(roadmapId: string) {
  const [roadmaps, setRoadmaps] = useState<Record<string, LearningRoadmap>>(
    () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : structuredClone(learningData);
    },
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
  }, [roadmaps]);

  const roadmap = useMemo(() => roadmaps[roadmapId], [roadmaps, roadmapId]);

  const completedDays = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days.filter(
      (day) => day.topics.length > 0 && day.topics.every((t) => t.completed),
    ).length;
  }, [roadmap]);

  const completedTopics = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days.flatMap((d) => d.topics).filter((t) => t.completed)
      .length;
  }, [roadmap]);

  const revisionTopics = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days.flatMap((d) => d.topics).filter((t) => t.revision)
      .length;
  }, [roadmap]);

  const totalTopics = useMemo(() => {
    if (!roadmap) return 0;

    return roadmap.days.reduce((acc, day) => acc + day.topics.length, 0);
  }, [roadmap]);

  const toggleComplete = (topicId: number) => {
    setRoadmaps((prev) => ({
      ...prev,
      [roadmapId]: {
        ...prev[roadmapId],
        days: prev[roadmapId].days.map((day) => ({
          ...day,
          topics: day.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  completed: !topic.completed,
                  revision: topic.completed ? topic.revision : false,
                }
              : topic,
          ),
        })),
      },
    }));
  };

  const toggleRevision = (topicId: number) => {
    setRoadmaps((prev) => ({
      ...prev,
      [roadmapId]: {
        ...prev[roadmapId],
        days: prev[roadmapId].days.map((day) => ({
          ...day,
          topics: day.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  revision: !topic.revision,
                }
              : topic,
          ),
        })),
      },
    }));
  };

  const getDay = (dayNumber: number) =>
    roadmap?.days.find((d) => d.day === dayNumber);

  return {
    roadmap,

    completedDays,
    completedTopics,
    revisionTopics,
    totalTopics,

    getDay,

    toggleComplete,
    toggleRevision,
  };
}
