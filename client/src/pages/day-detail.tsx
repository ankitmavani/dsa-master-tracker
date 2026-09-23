import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import QuestionCard from "@/components/layout/question-card";
import { useQuestions } from "@/hooks/use-questions";

export default function DayDetailPage() {
  const { dayId } = useParams();
  const navigate = useNavigate();

  const { questions, updateStatus } = useQuestions();

  const [tab, setTab] = useState<"all" | "complete" | "revision">("all");

  const currentDay = Number(dayId);

  const dayQuestions = useMemo(() => {
    const list = questions.filter((q) => q.day === currentDay);

    if (tab === "all") return list;

    return list.filter((q) => q.status === tab);
  }, [questions, currentDay, tab]);

  const total = questions.filter((q) => q.day === currentDay).length;

  const completed = questions.filter(
    (q) => q.day === currentDay && q.status === "complete",
  ).length;

  const revision = questions.filter(
    (q) => q.day === currentDay && q.status === "revision",
  ).length;

  const progress = total === 0 ? 0 : (completed / total) * 100;

  return (
    <main className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="neo-button bg-white px-4 py-2"
        >
          ← Back
        </button>

        {/* Header */}
        <section className="neo-card bg-yellow p-6">
          <p className="text-sm font-bold tracking-widest">
            DAY {String(currentDay).padStart(2, "0")}
          </p>

          <h1 className="font-heading mt-2 text-4xl font-bold">
            Daily Questions
          </h1>

          <p className="mt-2 font-medium">
            {total} Questions • {completed} Complete • {revision} Revision
          </p>

          {/* Progress */}
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm font-bold">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-4 rounded-full border-[3px] border-black bg-white">
              <div
                className="bg-green h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {(["all", "complete", "revision"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`neo-button px-5 py-2 capitalize ${
                tab === item ? "bg-yellow" : "bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Question List */}
        <section className="space-y-4">
          {dayQuestions.length === 0 ? (
            <div className="neo-card p-10 text-center">
              <h3 className="font-heading text-2xl font-bold">
                No Questions Found
              </h3>

              <p className="mt-2 text-gray-600">
                There are no questions in this category.
              </p>
            </div>
          ) : (
            dayQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onStatus={updateStatus}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
