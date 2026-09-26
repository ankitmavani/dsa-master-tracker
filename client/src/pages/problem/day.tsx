import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import QuestionCard from "@/components/layout/question-card";
import { useProblem } from "@/hooks/use-problem";

export default function ProblemDayPage() {
  const navigate = useNavigate();

  const { roadmapId = "", dayId = "" } = useParams();

  const [tab, setTab] = useState<"all" | "complete" | "revision">("all");

  const { roadmap, updateQuestionStatus } = useProblem(roadmapId);

  if (!roadmap) return <div>Not found</div>;

  const day = roadmap.days.find((d) => d.day === Number(dayId));

  if (!day) return <div>Day not found</div>;

  const filteredQuestions = useMemo(() => {
    if (tab === "all") return day.questions;

    return day.questions.filter((q) => q.status === tab);
  }, [day, tab]);

  const completed = day.questions.filter((q) => q.status === "complete").length;

  const revision = day.questions.filter((q) => q.status === "revision").length;

  const progress = (completed / day.questions.length) * 100;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/problem/${roadmapId}`)}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <section className="neo-card bg-yellow p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          {roadmap.title}
        </span>

        <h1 className="font-heading mt-4 text-4xl font-bold">
          Day {String(day.day).padStart(2, "0")}
        </h1>

        <h2 className="mt-1 text-xl font-semibold">{day.title}</h2>

        <p className="mt-3 text-sm font-medium">
          {completed}/{day.questions.length} Completed • {revision} Revision
        </p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-4 rounded-full border-[3px] border-black bg-white">
            <div
              className="h-full rounded-full bg-black"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

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

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onStatus={updateQuestionStatus}
          />
        ))}
      </div>
    </div>
  );
}
