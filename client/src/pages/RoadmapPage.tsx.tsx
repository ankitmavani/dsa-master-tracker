import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  BookOpen,
  Code2,
  ArrowRight,
  Calendar,
  Trophy,
  Sparkles,
  Plus,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { roadmapApi } from "@/services/roadmap.service";
import type {
  Roadmap,
  DashboardStats,
  RoadmapType,
  RoadmapColor,
} from "@/types/roadmap";

interface CreateRoadmapForm {
  title: string;
  description: string;
  type: RoadmapType;
  totalDays: number;
  color: RoadmapColor;
  icon: string;
}

const initialForm: CreateRoadmapForm = {
  title: "",
  description: "",
  type: "problem",
  totalDays: 30,
  color: "yellow",
  icon: "📚",
};

export default function RoadmapPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<RoadmapType>("problem");

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalRoadmaps: 0,
    totalDays: 0,
    completedDays: 0,
  });

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState<CreateRoadmapForm>(initialForm);

  const roadmapList = useMemo(() => {
    console.log(roadmaps);
    return (roadmaps || []).filter((r) => r.type === tab);
  }, [roadmaps, tab]);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);

      const res = await roadmapApi.getAll();

      const roadmapsData = res.data?.roadmaps || res.data || [];
      const statsData = res.data?.stats || {
        totalRoadmaps: roadmapsData.length,
        totalDays: roadmapsData.reduce(
          (sum: number, r: any) => sum + r.totalDays,
          0,
        ),
        completedDays: roadmapsData.reduce(
          (sum: number, r: any) => sum + (r.completedDays || 0),
          0,
        ),
      };

      setRoadmaps(roadmapsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      setRoadmaps([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await roadmapApi.getAll();

        console.log("API Response:", res);

        const roadmapData = Array.isArray(res.data) ? res.data : [];

        setRoadmaps(roadmapData);

        setStats({
          totalRoadmaps: roadmapData.length,
          totalDays: roadmapData.reduce(
            (sum: number, r: any) => sum + (r.totalDays || 0),
            0,
          ),
          completedDays: roadmapData.reduce(
            (sum: number, r: any) => sum + (r.completedDays || 0),
            0,
          ),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleCreate = async () => {
    if (!form.title.trim()) return;

    try {
      setCreating(true);

      await roadmapApi.create({
        id: slugify(form.title),
        title: form.title,
        description: form.description,
        type: form.type,
        totalDays: Number(form.totalDays),
        color: form.color,
        icon: form.icon,
      });

      setOpenModal(false);
      setForm(initialForm);

      await fetchRoadmaps();
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const cardColor = (color: RoadmapColor) => {
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
        return "bg-green";
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="neo-card bg-yellow relative overflow-hidden p-7">
        <div className="absolute -top-5 -right-5 rotate-12 rounded-3xl border-[3px] border-black bg-white p-4">
          <Sparkles size={34} />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border-[3px] border-black bg-white p-3">
                <BrainCircuit size={34} />
              </div>

              <div>
                <p className="text-xs font-black tracking-[0.25em]">
                  LEARNING OS
                </p>

                <h1 className="font-heading text-5xl font-black">Roadmaps</h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm font-semibold">
              One place to master DSA, SQL, Node.js, React, System Design and
              every future roadmap.
            </p>
          </div>

          {/* ADD ROADMAP BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="neo-button bg-black px-5 py-3 text-white"
          >
            <div className="flex items-center gap-2">
              <Plus size={18} />
              New Roadmap
            </div>
          </button>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-[3px] border-black bg-white p-4">
            <Calendar size={18} />

            <p className="mt-2 text-xs font-black">TOTAL DAYS</p>

            <h3 className="text-4xl font-black">{stats?.totalDays}</h3>
          </div>

          <div className="rounded-2xl border-[3px] border-black bg-white p-4">
            <Trophy size={18} />

            <p className="mt-2 text-xs font-black">COMPLETED</p>

            <h3 className="text-4xl font-black">{stats?.completedDays}</h3>
          </div>

          <div className="rounded-2xl border-[3px] border-black bg-white p-4">
            <BookOpen size={18} />

            <p className="mt-2 text-xs font-black">ROADMAPS</p>

            <h3 className="text-4xl font-black">{stats?.totalRoadmaps}</h3>
          </div>
        </div>
      </section>

      {/* TAB SWITCH */}
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

      {/* HEADER */}
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

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="neo-card animate-pulse bg-white p-6">
              <div className="h-5 w-20 rounded bg-gray-300" />

              <div className="mt-4 h-8 w-48 rounded bg-gray-300" />

              <div className="mt-3 h-4 w-full rounded bg-gray-200" />

              <div className="mt-8 h-4 rounded bg-gray-200" />

              <div className="mt-6 h-12 rounded-xl bg-gray-300" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {roadmapList.map((roadmap) => (
            <div
              key={roadmap.id}
              className={`neo-card ${cardColor(roadmap.color)} p-5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-black">
                    {roadmap?.totalDays} DAYS
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

              {/* PROGRESS */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm font-black">
                  <span>Progress</span>

                  <span>{roadmap.progress}%</span>
                </div>

                <div className="h-4 rounded-full border-[3px] border-black bg-white">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-500"
                    style={{
                      width: `${roadmap.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* ACTIONS */}
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
          ))}
        </div>
      )}

      {/* ================= CREATE ROADMAP MODAL ================= */}

      <Dialog
        open={openModal}
        onClose={() => !creating && setOpenModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="neo-card w-full max-w-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <Dialog.Title className="font-heading text-3xl font-black">
                Create Roadmap
              </Dialog.Title>

              <button
                onClick={() => setOpenModal(false)}
                className="rounded-lg border-[3px] border-black bg-white px-3 py-1 font-black"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-sm font-semibold opacity-70">
              Create a new Learning or Problem Solving roadmap.
            </p>

            <div className="mt-6 space-y-5">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-black">
                  Roadmap Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Node.js Mastery"
                  className="w-full rounded-xl border-[3px] border-black bg-white px-4 py-3 font-semibold outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-black">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Complete backend roadmap with practical projects..."
                  className="w-full rounded-xl border-[3px] border-black bg-white px-4 py-3 font-semibold outline-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-3 block text-sm font-black">
                  Roadmap Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setForm({ ...form, type: "problem" })}
                    className={`neo-button py-3 ${
                      form.type === "problem"
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Code2 size={18} />
                      Problem
                    </div>
                  </button>

                  <button
                    onClick={() => setForm({ ...form, type: "learning" })}
                    className={`neo-button py-3 ${
                      form.type === "learning"
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen size={18} />
                      Learning
                    </div>
                  </button>
                </div>
              </div>

              {/* Days + Icon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-black">
                    Total Days
                  </label>

                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={form.totalDays}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        totalDays: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border-[3px] border-black bg-white px-4 py-3 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black">Icon</label>

                  <input
                    value={form.icon}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        icon: e.target.value,
                      })
                    }
                    placeholder="📘"
                    className="w-full rounded-xl border-[3px] border-black bg-white px-4 py-3 text-center text-2xl outline-none"
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="mb-3 block text-sm font-black">
                  Card Color
                </label>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: "yellow", cls: "bg-yellow", label: "Yellow" },
                    { key: "green", cls: "bg-green", label: "Green" },
                    { key: "blue", cls: "bg-blue", label: "Blue" },
                    { key: "pink", cls: "bg-pink", label: "Pink" },
                  ].map((color) => (
                    <button
                      key={color.key}
                      onClick={() =>
                        setForm({
                          ...form,
                          color: color.key as RoadmapColor,
                        })
                      }
                      className={`rounded-xl border-[3px] border-black p-3 transition-all ${
                        form.color === color.key
                          ? "scale-105 ring-2 ring-black"
                          : ""
                      } ${color.cls}`}
                    >
                      <div className="text-center text-xs font-black">
                        {color.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="neo-button bg-white px-5 py-3"
              >
                Cancel
              </button>

              <button
                disabled={creating || !form.title.trim()}
                onClick={handleCreate}
                className="neo-button bg-black px-6 py-3 text-white disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Roadmap"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
