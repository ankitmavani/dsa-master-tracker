import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmaps } from "@/data/roadmaps";
import { days } from "@/data/days";
import { useQuestions } from "@/hooks/use-questions";
import QuestionCard from "@/components/layout/question-card";

export default function ProblemDayPage() {
  const navigate = useNavigate();

  const { roadmapId = "", dayId = "" } = useParams();

  const [tab, setTab] = useState<"all" | "complete" | "revision">("all");

  const { questions, updateStatus } = useQuestions();

  // Current roadmap
  const roadmap = roadmaps.find((r) => r.id === roadmapId);

  // Current day
  const day = days.find(
    (d) => d.roadmapId === roadmapId && d.day === Number(dayId),
  );

  // All questions of current day
  const dayQuestions = useMemo(() => {
    return questions.filter(
      (q) => q.roadmapId === roadmapId && q.day === Number(dayId),
    );
  }, [questions, roadmapId, dayId]);

  // Tab filter
  const filteredQuestions = useMemo(() => {
    if (tab === "all") return dayQuestions;

    return dayQuestions.filter((q) => q.status === tab);
  }, [dayQuestions, tab]);

  const completed = dayQuestions.filter((q) => q.status === "complete").length;

  const revision = dayQuestions.filter((q) => q.status === "revision").length;

  const progress =
    dayQuestions.length === 0 ? 0 : (completed / dayQuestions.length) * 100;

  if (!roadmap || !day) {
    return (
      <div className="neo-card bg-white p-10 text-center">
        <h2 className="font-heading text-3xl font-bold">Roadmap Not Found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}

      <button
        onClick={() => navigate(`/problem/${roadmapId}`)}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Hero */}

      <section className="neo-card bg-yellow p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          {roadmap.title}
        </span>

        <h1 className="font-heading mt-4 text-4xl font-bold">
          Day {String(day.day).padStart(2, "0")}
        </h1>

        <h2 className="mt-1 text-xl font-semibold">{day.title}</h2>

        <p className="mt-3 text-sm font-medium">
          {completed}/{dayQuestions.length} Completed • {revision} Revision
        </p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-4 rounded-full border-[3px] border-black bg-white">
            <div
              className="h-full rounded-full bg-black transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Tabs */}

      <div className="flex gap-3">
        {(["all", "complete", "revision"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`neo-button px-5 py-2 capitalize ${
              tab === item ? "bg-black text-white" : "bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Questions */}

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="neo-card bg-white p-10 text-center">
            <h3 className="font-heading text-2xl font-bold">No Questions</h3>

            <p className="mt-2 text-sm">No questions available in this tab.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onStatus={updateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
