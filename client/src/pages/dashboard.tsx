import { BookOpen, CheckCircle2, RotateCcw, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatCard from "@/components/dashboard/stat-card";
import RoadmapProgress from "@/components/dashboard/roadmap-progress";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    completedQuestions,
    revisionQuestions,
    completedTopics,
    totalQuestions,
    totalTopics,
    roadmapProgress,
  } = useDashboard();

  return (
    <div className="space-y-8">
      {/* Hero */}

      <section className="neo-card bg-yellow p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          LEARNING OS
        </span>

        <h1 className="font-heading mt-4 text-5xl font-bold">Dashboard</h1>

        <p className="mt-3 max-w-xl">
          Track every roadmap, solve questions, revise topics and become
          consistent.
        </p>
      </section>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Questions"
          value={completedQuestions}
          color="bg-green"
          icon={<CheckCircle2 size={24} />}
        />

        <StatCard
          title="Revision"
          value={revisionQuestions}
          color="bg-pink"
          icon={<RotateCcw size={24} />}
        />

        <StatCard
          title="Topics"
          value={completedTopics}
          color="bg-blue"
          icon={<BookOpen size={24} />}
        />

        <StatCard
          title="Total Items"
          value={totalQuestions + totalTopics}
          color="bg-white"
          icon={<BrainCircuit size={24} />}
        />
      </div>

      {/* Continue Learning */}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold">Roadmaps</h2>

          <button
            onClick={() => navigate("/roadmaps")}
            className="neo-button bg-white px-4 py-2"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {roadmapProgress.map((roadmap) => (
            <button
              key={roadmap.id}
              onClick={() =>
                navigate(
                  roadmap.type === "problem"
                    ? `/problem/${roadmap.id}`
                    : `/learning/${roadmap.id}`,
                )
              }
              className="w-full text-left"
            >
              <RoadmapProgress
                title={roadmap.title}
                completed={roadmap.completed}
                total={roadmap.totalDays}
                color={
                  roadmap.color === "yellow"
                    ? "bg-yellow"
                    : roadmap.color === "green"
                      ? "bg-green"
                      : roadmap.color === "blue"
                        ? "bg-blue"
                        : "bg-pink"
                }
              />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
