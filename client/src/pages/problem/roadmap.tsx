import { useState } from "react";
import { ArrowLeft, Shuffle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DayCard from "@/components/layout/day-card";
import { useProblem } from "@/hooks/use-problem";

export default function ProblemRoadmapPage() {
  const { roadmapId = "" } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"roadmap" | "random">("roadmap");

  const {
    roadmap,
    completedDays,
    completedQuestions,
    revisionQuestions,
    totalQuestions,
  } = useProblem(roadmapId);

  if (!roadmap) {
    return <div>Roadmap not found</div>;
  }

  const progress = (completedDays / roadmap.days.length) * 100;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <section className="neo-card bg-yellow p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          {roadmap.days.length} DAYS
        </span>

        <h1 className="font-heading mt-4 text-5xl font-bold">
          {roadmap.title}
        </h1>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Progress</span>
            <span>
              {completedDays}/{roadmap.days.length}
            </span>
          </div>

          <div className="h-4 rounded-full border-[3px] border-black bg-white">
            <div
              className="h-full rounded-full bg-black"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="neo-card bg-green p-4">
          <p className="text-xs font-semibold">Completed Days</p>
          <h2 className="font-heading mt-2 text-3xl font-bold">
            {completedDays}
          </h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <p className="text-xs font-semibold">Revision</p>
          <h2 className="font-heading mt-2 text-3xl font-bold">
            {revisionQuestions}
          </h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <p className="text-xs font-semibold">Questions</p>
          <h2 className="font-heading mt-2 text-3xl font-bold">
            {totalQuestions}
          </h2>
        </div>

        <div className="neo-card bg-white p-4">
          <p className="text-xs font-semibold">Completed</p>
          <h2 className="font-heading mt-2 text-3xl font-bold">
            {completedQuestions}
          </h2>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setTab("roadmap")}
          className={`neo-button px-5 py-2 ${
            tab === "roadmap" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Roadmap
        </button>

        <button
          onClick={() => setTab("random")}
          className={`neo-button px-5 py-2 ${
            tab === "random" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Random Question
        </button>
      </div>

      {tab === "roadmap" && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {roadmap.days.map((day) => (
            <DayCard
              key={day.day}
              roadmapId={roadmap.id}
              day={day.day}
              title={day.title}
              completed={day.questions.every((q) => q.status === "complete")}
            />
          ))}
        </div>
      )}

      {tab === "random" && (
        <div className="neo-card bg-blue p-8 text-center">
          <Shuffle size={42} className="mx-auto" />

          <h2 className="font-heading mt-4 text-3xl font-bold">
            Random Question
          </h2>

          <button
            onClick={() => navigate(`/problem/${roadmap.id}/random`)}
            className="neo-button bg-yellow mt-6 px-6 py-3"
          >
            Open Random
          </button>
        </div>
      )}
    </div>
  );
}
