import { useEffect, useState } from "react";
import { learningTopics as initialData } from "@/data/learning-topics";
import type { LearningTopic } from "@/types/learning";

const STORAGE = "learning-topics";

export function useLearning() {
  const [topics, setTopics] = useState<LearningTopic[]>(() => {
    const saved = localStorage.getItem(STORAGE);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(topics));
  }, [topics]);

  const toggleComplete = (id: number) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              revision: t.completed ? t.revision : false,
            }
          : t,
      ),
    );
  };

  const toggleRevision = (id: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, revision: !t.revision } : t)),
    );
  };

  return {
    topics,
    toggleComplete,
    toggleRevision,
  };
}
