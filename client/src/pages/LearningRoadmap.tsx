import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  CalendarDays,
  Plus,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmapApi } from "@/services/roadmap.service";
import { dayApi } from "@/services/day.service";

interface Day {
  id: string;
  day: number;
  title: string;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  type: string;
}

export default function LearningRoadmapPage() {
  const navigate = useNavigate();
  const { roadmapId = "" } = useParams();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [days, setDays] = useState<Day[]>([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [dayTitle, setDayTitle] = useState("");

  const fetchRoadmap = async () => {
    try {
      setLoading(true);

      const res = await roadmapApi.getById(roadmapId);

      setRoadmap(res.data.roadmap);
      setDays(res.data.days);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [roadmapId]);

  const handleAddDay = async () => {
    if (!dayTitle.trim()) return;

    await dayApi.create({
      roadmapId,
      title: dayTitle,
    });

    setDayTitle("");
    setOpen(false);

    fetchRoadmap();
  };

  const progress = useMemo(() => {
    if (!roadmap) return 0;
    return (days.length / roadmap.totalDays) * 100;
  }, [days, roadmap]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roadmap) {
    return <div>Roadmap not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* HERO */}
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
              {days.length}/{roadmap.totalDays} Days
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

      {/* STATS */}
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
          <p className="mt-2 text-xs font-semibold">Created</p>
          <h2 className="font-heading text-3xl font-bold">{days.length}</h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <RotateCcw size={22} />
          <p className="mt-2 text-xs font-semibold">Remaining</p>
          <h2 className="font-heading text-3xl font-bold">
            {roadmap.totalDays - days.length}
          </h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <BookOpen size={22} />
          <p className="mt-2 text-xs font-semibold">Progress</p>
          <h2 className="font-heading text-3xl font-bold">
            {Math.round(progress)}%
          </h2>
        </div>
      </div>

      {/* DAYS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold">All Days</h2>

          <button
            onClick={() => setOpen(true)}
            className="neo-button bg-black px-4 py-2 text-white"
          >
            <div className="flex items-center gap-2">
              <Plus size={16} />
              Add Day
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => navigate(`/learning/${roadmapId}/day/${day.day}`)}
              className="neo-card bg-white p-4 text-left transition hover:-translate-y-1"
            >
              <div className="mb-3 flex justify-between">
                <span className="bg-yellow rounded-lg border-[3px] border-black px-3 py-1 font-bold">
                  {String(day.day).padStart(2, "0")}
                </span>
                📚
              </div>

              <h3 className="font-heading font-bold">Day {day.day}</h3>

              <p className="mt-1 text-sm opacity-70">{day.title}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ADD DAY MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="neo-card w-full max-w-md bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Add New Day</h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <label className="text-sm font-bold">Day Title</label>

            <input
              value={dayTitle}
              onChange={(e) => setDayTitle(e.target.value)}
              placeholder="Node.js Basics"
              className="mt-2 w-full rounded-xl border-[3px] border-black px-4 py-3 outline-none"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="neo-button bg-white"
              >
                Cancel
              </button>

              <button
                onClick={handleAddDay}
                className="neo-button bg-black text-white"
              >
                Create Day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
