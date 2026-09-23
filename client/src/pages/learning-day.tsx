import { useMemo } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmaps } from "@/data/roadmaps";
import { learningDays } from "@/data/learning-days";
import { useLearning } from "@/hooks/use-learning";
import TopicCard from "@/components/topic-card";

export default function LearningDayPage() {
  const navigate = useNavigate();

  const { roadmapId = "", dayId = "" } = useParams();

  const roadmap = roadmaps.find((r) => r.id === roadmapId);

  const day = learningDays.find(
    (d) => d.roadmapId === roadmapId && d.day === Number(dayId),
  );

  const { topics, toggleComplete, toggleRevision } = useLearning();

  const dayTopics = useMemo(
    () =>
      topics.filter(
        (t) => t.roadmapId === roadmapId && t.day === Number(dayId),
      ),
    [topics, roadmapId, dayId],
  );

  const completed = dayTopics.filter((t) => t.completed).length;

  const revision = dayTopics.filter((t) => t.revision).length;

  const remaining = dayTopics.length - completed;

  const progress =
    dayTopics.length === 0 ? 0 : (completed / dayTopics.length) * 100;

  if (!roadmap || !day) {
    return (
      <div className="neo-card bg-white p-10 text-center">
        <h2 className="font-heading text-3xl font-bold">Day Not Found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}

      <button
        onClick={() => navigate(`/learning/${roadmapId}`)}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Hero */}

      <section className="neo-card bg-green p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          {roadmap.title}
        </span>

        <h1 className="font-heading mt-4 text-4xl font-bold">
          Day {String(day.day).padStart(2, "0")}
        </h1>

        <h2 className="mt-1 text-2xl font-semibold">{day.title}</h2>

        <p className="mt-3 text-sm font-medium">
          {completed}/{dayTopics.length} Topics Completed
        </p>

        {/* Progress */}

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

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="neo-card bg-yellow p-4">
          <BookOpen size={22} />

          <p className="mt-2 text-xs font-semibold">Topics</p>

          <h2 className="font-heading text-3xl font-bold">
            {dayTopics.length}
          </h2>
        </div>

        <div className="neo-card bg-green p-4">
          <CheckCircle2 size={22} />

          <p className="mt-2 text-xs font-semibold">Complete</p>

          <h2 className="font-heading text-3xl font-bold">{completed}</h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <RotateCcw size={22} />

          <p className="mt-2 text-xs font-semibold">Revision</p>

          <h2 className="font-heading text-3xl font-bold">{revision}</h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <Clock size={22} />

          <p className="mt-2 text-xs font-semibold">Remaining</p>

          <h2 className="font-heading text-3xl font-bold">{remaining}</h2>
        </div>
      </div>

      {/* Topic List */}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold">Topics</h2>

          <span className="rounded-full border-[3px] border-black bg-white px-4 py-2 font-bold">
            {dayTopics.length}
          </span>
        </div>

        {dayTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onComplete={toggleComplete}
            onRevision={toggleRevision}
          />
        ))}
      </section>
    </div>
  );
}
