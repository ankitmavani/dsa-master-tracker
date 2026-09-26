import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Shuffle, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmapApi } from "@/services/roadmap.service";
import { dayApi } from "@/services/day.service";

interface Roadmap {
  id: string;
  title: string;
  description: string;
  totalDays: number;
}

interface Day {
  id: string;
  day: number;
  title: string;
}

export default function ProblemRoadmapPage() {
  const navigate = useNavigate();
  const { roadmapId = "" } = useParams();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [days, setDays] = useState<Day[]>([]);

  const [loading, setLoading] = useState(true);

  const [openDay, setOpenDay] = useState(false);
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

  const handleCreateDay = async () => {
    if (!dayTitle.trim()) return;

    await dayApi.create({
      roadmapId,
      title: dayTitle,
    });

    setDayTitle("");
    setOpenDay(false);

    fetchRoadmap();
  };

  const progress = useMemo(() => {
    if (!roadmap) return 0;

    return (days.length / roadmap.totalDays) * 100;
  }, [days, roadmap]);

  if (loading) return <div>Loading...</div>;

  if (!roadmap) return <div>Roadmap Not Found</div>;

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

        <h1 className="font-heading mt-4 text-5xl font-black">
          {roadmap.title}
        </h1>

        <p className="mt-2">{roadmap.description}</p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-black">
            <span>Progress</span>
            <span>
              {days.length}/{roadmap.totalDays}
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
          <p className="text-xs font-semibold">Created Days</p>
          <h2 className="font-heading mt-2 text-3xl font-black">
            {days.length}
          </h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <p className="text-xs font-semibold">Remaining</p>
          <h2 className="font-heading mt-2 text-3xl font-black">
            {roadmap.totalDays - days.length}
          </h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <p className="text-xs font-semibold">Progress</p>
          <h2 className="font-heading mt-2 text-3xl font-black">
            {Math.round(progress)}%
          </h2>
        </div>

        <div className="neo-card bg-white p-4">
          <p className="text-xs font-semibold">Roadmap</p>
          <h2 className="font-heading mt-2 text-xl font-black">DSA</h2>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setOpenDay(true)}
          className="neo-button bg-black px-5 py-2 text-white"
        >
          <div className="flex items-center gap-2">
            <Plus size={18} />
            Add Day
          </div>
        </button>

        <button
          onClick={() => navigate(`/problem/${roadmapId}/random`)}
          className="neo-button bg-blue px-5 py-2"
        >
          <div className="flex items-center gap-2">
            <Shuffle size={18} />
            Random
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => navigate(`/problem/${roadmapId}/day/${day.day}`)}
            className="neo-card bg-white p-4 text-left transition hover:-translate-y-1"
          >
            <div className="mb-3 flex justify-between">
              <span className="bg-yellow rounded-lg border-[3px] border-black px-3 py-1 font-bold">
                {String(day.day).padStart(2, "0")}
              </span>
              🧩
            </div>

            <h3 className="font-heading font-black">Day {day.day}</h3>

            <p className="mt-1 text-sm opacity-70">{day.title}</p>
          </button>
        ))}
      </div>

      {openDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="neo-card w-full max-w-md bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-black">Add New Day</h2>

              <button onClick={() => setOpenDay(false)}>
                <X />
              </button>
            </div>

            <input
              value={dayTitle}
              onChange={(e) => setDayTitle(e.target.value)}
              placeholder="Array Basics"
              className="w-full rounded-xl border-[3px] border-black px-4 py-3"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenDay(false)}
                className="neo-button bg-white"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateDay}
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
