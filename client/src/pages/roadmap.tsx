import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  BookOpen,
  Code2,
  ArrowRight,
  Calendar,
  Trophy,
  Sparkles,
} from "lucide-react";

import { roadmaps } from "@/data/roadmaps";
import { days } from "@/data/days";
import { useQuestions } from "@/hooks/use-questions";
import { useLearning } from "@/hooks/use-learning";
import type { RoadmapType } from "@/types/roadmaps";

export default function RoadmapPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<RoadmapType>("problem");

  const { questions } = useQuestions();
  const { topics } = useLearning();

  // Dynamic roadmap progress
  const roadmapList = useMemo(() => {
    return roadmaps
      .filter((r) => r.type === tab)
      .map((roadmap) => {
        const roadmapDays = days.filter((d) => d.roadmapId === roadmap.id);

        const completedDays = roadmapDays.filter((day) => {
          if (roadmap.type === "problem") {
            const list = questions.filter(
              (q) => q.roadmapId === roadmap.id && q.day === day.day,
            );

            return (
              list.length > 0 && list.every((q) => q.status === "complete")
            );
          }

          const list = topics.filter(
            (t) => t.roadmapId === roadmap.id && t.day === day.day,
          );

          return list.length > 0 && list.every((t) => t.completed);
        }).length;

        return {
          ...roadmap,
          completedDays,
        };
      });
  }, [tab, questions, topics]);

  // Hero stats
  const totalRoadmaps = roadmaps.length;

  const totalDays = roadmaps.reduce((sum, r) => sum + r.totalDays, 0);

  const completedDays = roadmapList.reduce(
    (sum, r) => sum + r.completedDays,
    0,
  );

  const cardColor = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow";
      case "green":
        return "bg-green";
      case "blue":
        return "bg-blue";
      case "pink":
        return "bg-pink";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO */}

      <section className="neo-card bg-yellow relative overflow-hidden p-7">
        <div className="absolute -top-5 -right-5 rotate-12 rounded-3xl border-[3px] border-black bg-white p-4">
          <Sparkles size={34} />
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl border-[3px] border-black bg-white p-3">
            <BrainCircuit size={34} />
          </div>

          <div>
            <p className="text-xs font-black tracking-[0.25em]">LEARNING OS</p>

            <h1 className="font-heading text-5xl font-black">Roadmaps</h1>
          </div>
        </div>

        <p className="mt-4 max-w-xl text-sm font-semibold">
          One place to master DSA, SQL, Node.js, React, System Design and every
          future roadmap.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border-[3px] border-black bg-white p-3">
            <Calendar size={18} />

            <p className="mt-2 text-xs font-bold">TOTAL DAYS</p>

            <h2 className="text-3xl font-black">{totalDays}</h2>
          </div>

          <div className="rounded-xl border-[3px] border-black bg-white p-3">
            <Trophy size={18} />

            <p className="mt-2 text-xs font-bold">COMPLETED</p>

            <h2 className="text-3xl font-black">{completedDays}</h2>
          </div>

          <div className="rounded-xl border-[3px] border-black bg-white p-3">
            <BookOpen size={18} />

            <p className="mt-2 text-xs font-bold">ROADMAPS</p>

            <h2 className="text-3xl font-black">{totalRoadmaps}</h2>
          </div>
        </div>
      </section>

      {/* TABS */}

      <div className="flex gap-3">
        <button
          onClick={() => setTab("problem")}
          className={`neo-button flex-1 py-3 ${
            tab === "problem" ? "bg-black text-white" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Code2 size={18} />
            Problem Solve
          </div>
        </button>

        <button
          onClick={() => setTab("learning")}
          className={`neo-button flex-1 py-3 ${
            tab === "learning" ? "bg-black text-white" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen size={18} />
            Learning
          </div>
        </button>
      </div>

      {/* TITLE */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-black">
            {tab === "problem" ? "Problem Roadmaps" : "Learning Roadmaps"}
          </h2>

          <p className="text-sm font-semibold opacity-70">
            {roadmapList.length} Available Roadmaps
          </p>
        </div>

        <div className="rounded-full border-[3px] border-black bg-white px-4 py-2 font-black">
          {roadmapList.length}
        </div>
      </div>

      {/* ROADMAP CARDS */}

      <div className="grid gap-6 lg:grid-cols-2">
        {roadmapList.map((roadmap) => {
          const progress = (roadmap.completedDays / roadmap.totalDays) * 100;

          return (
            <div
              key={roadmap.id}
              className={`neo-card ${cardColor(roadmap.color)} p-5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-black">
                    {roadmap.totalDays} DAYS
                  </div>

                  <h3 className="font-heading text-3xl font-black">
                    {roadmap.title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold opacity-75">
                    {roadmap.description}
                  </p>
                </div>

                <div className="rounded-xl border-[3px] border-black bg-white px-3 py-2 text-center">
                  <p className="text-[10px] font-bold">DONE</p>

                  <h4 className="text-2xl font-black">
                    {roadmap.completedDays}
                  </h4>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm font-black">
                  <span>Progress</span>

                  <span>{Math.round(progress)}%</span>
                </div>

                <div className="h-4 rounded-full border-[3px] border-black bg-white">
                  <div
                    className="h-full rounded-full bg-black transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    navigate(
                      roadmap.type === "problem"
                        ? `/problem/${roadmap.id}`
                        : `/learning/${roadmap.id}`,
                    )
                  }
                  className="neo-button flex-1 bg-white py-3"
                >
                  <div className="flex items-center justify-center gap-2 font-black">
                    Open Roadmap
                    <ArrowRight size={16} />
                  </div>
                </button>

                {roadmap.type === "problem" && (
                  <button
                    onClick={() => navigate(`/problem/${roadmap.id}/random`)}
                    className="neo-button bg-black px-4 text-white"
                  >
                    🎲
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
