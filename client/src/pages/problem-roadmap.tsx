import { useState } from "react";
import { ArrowLeft, Shuffle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DayCard from "@/components/layout/day-card";
import { useRoadmap } from "@/hooks/use-roadmaps";

export default function ProblemRoadmapPage() {
  const { roadmapId = "" } = useParams();

  const navigate = useNavigate();

  const [tab, setTab] = useState<"roadmap" | "random">("roadmap");

  const {
    roadmap,
    roadmapDays,
    roadmapQuestions,
    completedQuestions,
    revisionQuestions,
    completedDays,
  } = useRoadmap(roadmapId);

  if (!roadmap) {
    return <div>Roadmap Not Found</div>;
  }

  const progress = (completedDays / roadmap.totalDays) * 100;

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
          {roadmap.totalDays} DAYS
        </span>

        <h1 className="font-heading mt-4 text-5xl font-bold">
          {roadmap.title}
        </h1>

        <p className="mt-2">{roadmap.description}</p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Progress</span>

            <span>
              {completedDays}/{roadmap.totalDays}
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
            {roadmapQuestions.length}
          </h2>
        </div>

        <div className="neo-card bg-white p-4">
          <p className="text-xs font-semibold">Completed Q.</p>
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
          {roadmapDays.map((day) => {
            const list = roadmapQuestions.filter((q) => q.day === day.day);

            const completed =
              list.length > 0 && list.every((q) => q.status === "complete");

            return (
              <DayCard
                key={day.day}
                roadmapId={roadmapId}
                day={day.day}
                title={day.title}
                completed={completed}
              />
            );
          })}
        </div>
      )}

      {tab === "random" && (
        <div className="neo-card bg-blue p-8 text-center">
          <Shuffle size={42} className="mx-auto" />

          <h2 className="font-heading mt-4 text-3xl font-bold">
            {roadmap.title} Random
          </h2>

          <p className="mt-2">Generate questions only from this roadmap.</p>

          <button
            onClick={() => navigate(`/problem/${roadmapId}/random`)}
            className="neo-button bg-yellow mt-6 px-6 py-3"
          >
            Open Random Question
          </button>
        </div>
      )}
    </div>
  );
}
