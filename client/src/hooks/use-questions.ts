import { useEffect, useState } from "react";
import { questions as initialQuestions } from "@/data/questions";
import type { Question, QuestionStatus } from "@/types/question";

const STORAGE_KEY = "learning-os-questions";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialQuestions;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  const updateStatus = (questionId: number, status: QuestionStatus) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status } : q)),
    );
  };

  return {
    questions,
    updateStatus,
  };
}
