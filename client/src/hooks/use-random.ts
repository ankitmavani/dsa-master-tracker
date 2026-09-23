import { useState } from "react";
import type { Question } from "@/types/question";

export function useRandom(roadmapId: string) {
  const STORAGE_KEY = `random-history-${roadmapId}`;

  const [shownIds, setShownIds] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const save = (ids: number[]) => {
    setShownIds(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const generate = (questions: Question[]) => {
    const revision = questions.filter((q) => q.status === "revision");

    const complete = questions.filter((q) => q.status === "complete");

    const pool = revision.length ? revision : complete;

    if (!pool.length) return null;

    let available = pool.filter((q) => !shownIds.includes(q.id));

    // Reset cycle
    if (available.length === 0) {
      save([]);
      available = pool;
    }

    const random = available[Math.floor(Math.random() * available.length)];

    save([...shownIds, random.id]);

    return random;
  };

  return { generate };
}
