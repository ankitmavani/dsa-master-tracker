import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  CalendarDays,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmaps } from "@/data/roadmaps";
import { learningDays } from "@/data/learning-days";
import { useLearning } from "@/hooks/use-learning";

export default function LearningRoadmapPage() {
  const navigate = useNavigate();
  const { roadmapId = "" } = useParams();

  const roadmap = roadmaps.find((r) => r.id === roadmapId);

  const { topics } = useLearning();

  const roadmapDays = learningDays.filter((d) => d.roadmapId === roadmapId);

  const roadmapTopics = topics.filter((t) => t.roadmapId === roadmapId);

  // const completedTopics = roadmapTopics.filter((t) => t.completed).length;

  const revisionTopics = roadmapTopics.filter((t) => t.revision).length;

  const completedDays = roadmapDays.filter((day) => {
    const list = roadmapTopics.filter((t) => t.day === day.day);

    return list.length > 0 && list.every((t) => t.completed);
  }).length;

  const progress =
    roadmapDays.length === 0 ? 0 : (completedDays / roadmapDays.length) * 100;

  if (!roadmap) return <div>Roadmap not found</div>;

  return (
    <div className="space-y-6">
      {/* Back */}

      <button
        onClick={() => navigate("/")}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Hero */}

      <section className="neo-card bg-green p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          LEARNING ROADMAP
        </span>

        <h1 className="font-heading mt-4 text-5xl font-bold">
          {roadmap.title}
        </h1>

        <p className="mt-2">{roadmap.description}</p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Progress</span>

            <span>
              {completedDays}/{roadmap.totalDays} Days
            </span>
          </div>

          <div className="h-4 rounded-full border-[3px] border-black bg-white">
            <div
              className="h-full rounded-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="neo-card bg-yellow p-4">
          <CalendarDays size={22} />

          <p className="mt-2 text-xs font-semibold">Total Days</p>

          <h2 className="font-heading text-3xl font-bold">
            {roadmap.totalDays}
          </h2>
        </div>

        <div className="neo-card bg-green p-4">
          <CheckCircle2 size={22} />

          <p className="mt-2 text-xs font-semibold">Complete</p>

          <h2 className="font-heading text-3xl font-bold">{completedDays}</h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <RotateCcw size={22} />

          <p className="mt-2 text-xs font-semibold">Revision</p>

          <h2 className="font-heading text-3xl font-bold">{revisionTopics}</h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <BookOpen size={22} />

          <p className="mt-2 text-xs font-semibold">Topics</p>

          <h2 className="font-heading text-3xl font-bold">
            {roadmapTopics.length}
          </h2>
        </div>
      </div>

      {/* Days Grid */}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold">All Days</h2>

          <span className="rounded-full border-[3px] border-black bg-white px-4 py-2 font-bold">
            {roadmapDays.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {roadmapDays.map((day) => {
            const list = roadmapTopics.filter((t) => t.day === day.day);

            const done = list.length > 0 && list.every((t) => t.completed);

            return (
              <button
                key={day.day}
                onClick={() =>
                  navigate(`/learning/${roadmapId}/day/${day.day}`)
                }
                className={`neo-card p-4 text-left transition hover:-translate-y-1 ${
                  done ? "bg-green" : "bg-white"
                }`}
              >
                <div className="mb-3 flex justify-between">
                  <span className="bg-yellow rounded-lg border-[3px] border-black px-3 py-1 font-bold">
                    {String(day.day).padStart(2, "0")}
                  </span>

                  {done ? "✅" : "📚"}
                </div>

                <h3 className="font-heading font-bold">Day {day.day}</h3>

                <p className="mt-1 text-sm opacity-70">{day.title}</p>

                <div className="mt-3 text-xs font-semibold">
                  {list.filter((t) => t.completed).length}/{list.length} Topics
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
