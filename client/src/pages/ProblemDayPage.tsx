import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  RotateCcw,
  Clock,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmapApi } from "@/services/roadmap.service";
import { questionApi } from "@/services/question.service";
import QuestionCard from "@/components/QuestionCard";
// import { questionApi } from "@/services/question.service";
// import QuestionCard from "@/components/QuestionCard";

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

export interface Question {
  id: string;
  roadmapId: string;
  dayId: string;
  day: number;

  title: string;
  description: string;

  leetcodeUrl: string;
  gfgUrl: string;

  difficulty: "Easy" | "Medium" | "Hard";

  tags: string[];

  notes: string;

  status: "pending" | "complete" | "revision";
}

const initialForm = {
  title: "",
  description: "",
  leetcodeUrl: "",
  gfgUrl: "",
  difficulty: "Easy" as const,
  tags: "",
  notes: "",
};

export default function ProblemDayPage() {
  const navigate = useNavigate();

  const { roadmapId = "", dayId = "" } = useParams();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [day, setDay] = useState<Day | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"all" | "complete" | "revision">("all");

  const [open, setOpen] = useState(false);

  const [saving] = useState(false);

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await roadmapApi.getById(roadmapId);

      const roadmapData = res.data.roadmap;

      const currentDay = res.data.days.find(
        (d: Day) => d.day === Number(dayId),
      );

      setRoadmap(roadmapData);
      setDay(currentDay);

      if (currentDay) {
        const q = await questionApi.getByDay(currentDay.id);

        setQuestions(q.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roadmapId, dayId]);

  const handleCreate = async () => {
    if (!day || !roadmap) return;

    await questionApi.create({
      id: `${day.id}-${Date.now()}`,

      roadmapId,
      dayId: day.id,
      day: day.day,

      title: form.title,
      description: form.description,

      leetcodeUrl: form.leetcodeUrl,
      gfgUrl: form.gfgUrl,

      difficulty: form.difficulty,

      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),

      notes: form.notes,

      status: "pending",
    });

    setForm(initialForm);

    setOpen(false);

    fetchData();
  };

  const filtered = useMemo(() => {
    if (tab === "all") return questions;

    return questions.filter((q) => q.status === tab);
  }, [questions, tab]);

  const completed = questions.filter((q) => q.status === "complete").length;

  const revision = questions.filter((q) => q.status === "revision").length;

  const remaining = questions.length - completed;

  const progress =
    questions.length === 0 ? 0 : (completed / questions.length) * 100;

  if (loading) return <div>Loading...</div>;

  if (!roadmap || !day) return <div>Day not found</div>;

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

        <h1 className="font-heading mt-4 text-4xl font-black">
          Day {String(day.day).padStart(2, "0")}
        </h1>

        <h2 className="mt-1 text-2xl font-bold">{day.title}</h2>

        <p className="mt-3 text-sm font-medium">
          {completed}/{questions.length} Questions Completed
        </p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-black">
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="neo-card bg-yellow p-4">
          <Clock size={20} />
          <p className="mt-2 text-xs font-bold">Questions</p>
          <h2 className="text-3xl font-black">{questions.length}</h2>
        </div>

        <div className="neo-card bg-green p-4">
          <CheckCircle2 size={20} />
          <p className="mt-2 text-xs font-bold">Complete</p>
          <h2 className="text-3xl font-black">{completed}</h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <RotateCcw size={20} />
          <p className="mt-2 text-xs font-bold">Revision</p>
          <h2 className="text-3xl font-black">{revision}</h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <Clock size={20} />
          <p className="mt-2 text-xs font-bold">Remaining</p>
          <h2 className="text-3xl font-black">{remaining}</h2>
        </div>
      </div>

      <div className="flex items-center justify-between">
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

        <button
          onClick={() => setOpen(true)}
          className="neo-button bg-black px-4 py-2 text-white"
        >
          <div className="flex items-center gap-2">
            <Plus size={16} />
            Add Question
          </div>
        </button>
      </div>

      <section className="space-y-4">
        {filtered.length === 0 ? (
          <div className="neo-card bg-white p-10 text-center">
            <h3 className="font-heading text-2xl font-black">No Questions</h3>

            <p className="mt-2 text-sm opacity-70">
              Add your first LeetCode question.
            </p>
          </div>
        ) : (
          filtered.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onRefresh={fetchData}
            />
          ))
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="neo-card w-full max-w-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl font-black">Add Question</h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                placeholder="Two Sum"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <textarea
                rows={3}
                placeholder="Problem description..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <input
                placeholder="LeetCode URL"
                value={form.leetcodeUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leetcodeUrl: e.target.value,
                  })
                }
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <input
                placeholder="GeeksForGeeks URL"
                value={form.gfgUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gfgUrl: e.target.value,
                  })
                }
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      difficulty: e.target.value as any,
                    })
                  }
                  className="rounded-xl border-[3px] border-black px-4 py-3"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>

                <input
                  placeholder="array, hash"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="rounded-xl border-[3px] border-black px-4 py-3"
                />
              </div>

              <textarea
                rows={4}
                placeholder="Notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="neo-button bg-white"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleCreate}
                className="neo-button bg-black text-white"
              >
                Create Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
