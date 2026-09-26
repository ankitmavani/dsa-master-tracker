import { useState } from "react";
import type { Question } from "@/types/problem";

export function useRandom(roadmapId: string) {
  const STORAGE_KEY = `random-history-${roadmapId}`;

  const [history, setHistory] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : [];
  });

  const saveHistory = (ids: number[]) => {
    setHistory(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const resetHistory = () => {
    saveHistory([]);
  };

  const generate = (questions: Question[]) => {
    if (!questions.length) return null;

    const revision = questions.filter((q) => q.status === "revision");

    const complete = questions.filter((q) => q.status === "complete");

    const pool = revision.length ? revision : complete;

    if (!pool.length) return null;

    let available = pool.filter((q) => !history.includes(q.id));

    if (available.length === 0) {
      saveHistory([]);
      available = pool;
    }

    const random = available[Math.floor(Math.random() * available.length)];

    saveHistory([...history, random.id]);

    return random;
  };

  return {
    generate,
    resetHistory,
    history,
  };
}
