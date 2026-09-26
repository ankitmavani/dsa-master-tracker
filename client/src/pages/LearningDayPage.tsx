import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Clock,
  Plus,
  Star,
  Video,
  FileText,
  StickyNote,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmapApi } from "@/services/roadmap.service";
import { itemApi } from "@/services/item.service";
import TopicCard from "@/components/topic-card";
// import TopicCard from "@/components/TopicCard";

interface Roadmap {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  type: "learning" | "problem";
}

interface Day {
  id: string;
  day: number;
  title: string;
}

export interface Topic {
  id: string;
  roadmapId: string;
  dayId: string;
  day: number;

  type: "learning" | "problem";

  title: string;
  description: string;

  videoUrl: string;
  articleUrl: string;
  notes: string;

  flags: {
    completed: boolean;
    revision: boolean;
    important: boolean;
    favorite: boolean;
  };
}

const initialTopic = {
  title: "",
  description: "",
  videoUrl: "",
  articleUrl: "",
  notes: "",
  important: false,
};

export default function LearningDayPage() {
  const navigate = useNavigate();

  const { roadmapId = "", dayId = "" } = useParams();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const [day, setDay] = useState<Day | null>(null);

  const [topics, setTopics] = useState<Topic[]>([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [saving, setSaving] = useState(false);

  const [topicForm, setTopicForm] = useState(initialTopic);

  const fetchData = async () => {
    try {
      setLoading(true);

      const roadmapRes = await roadmapApi.getById(roadmapId);

      const roadmapData = roadmapRes.data.roadmap;

      const currentDay = roadmapRes.data.days.find(
        (d: Day) => d.day === Number(dayId),
      );

      setRoadmap(roadmapData);
      setDay(currentDay);

      if (currentDay) {
        const topicRes = await itemApi.getByDay(currentDay.id);

        setTopics(topicRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roadmapId, dayId]);

  const handleCreateTopic = async () => {
    if (!day || !roadmap) return;

    if (!topicForm.title.trim()) return;

    try {
      setSaving(true);

      const id = `${day.id}-${Date.now()}`;

      await itemApi.create({
        id,
        roadmapId: roadmap.id,
        dayId: day.id,
        day: day.day,

        type: "learning",

        title: topicForm.title,
        description: topicForm.description,

        videoUrl: topicForm.videoUrl,
        articleUrl: topicForm.articleUrl,

        notes: topicForm.notes,

        flags: {
          completed: false,
          revision: false,
          important: topicForm.important,
          favorite: false,
        },
      });

      setOpenModal(false);

      setTopicForm(initialTopic);

      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const completed = useMemo(
    () => topics.filter((t) => t.flags.completed).length,
    [topics],
  );

  const revision = useMemo(
    () => topics.filter((t) => t.flags.revision).length,
    [topics],
  );

  const important = useMemo(
    () => topics.filter((t) => t.flags.important).length,
    [topics],
  );

  const remaining = topics.length - completed;

  const progress = topics.length === 0 ? 0 : (completed / topics.length) * 100;

  if (loading) {
    return <div className="neo-card bg-white p-10 text-center">Loading...</div>;
  }

  if (!roadmap || !day) {
    return (
      <div className="neo-card bg-white p-10 text-center">Day Not Found</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BACK */}
      <button
        onClick={() => navigate(`/learning/${roadmapId}`)}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* HERO */}
      <section className="neo-card bg-green p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          {roadmap.title}
        </span>

        <h1 className="font-heading mt-4 text-4xl font-black">
          Day {String(day.day).padStart(2, "0")}
        </h1>

        <h2 className="mt-1 text-2xl font-bold">{day.title}</h2>

        <p className="mt-3 text-sm font-medium">
          {completed}/{topics.length} Topics Completed
        </p>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-black">
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

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="neo-card bg-yellow p-4">
          <BookOpen size={22} />
          <p className="mt-2 text-xs font-bold">Topics</p>
          <h2 className="font-heading text-3xl font-black">{topics.length}</h2>
        </div>

        <div className="neo-card bg-green p-4">
          <CheckCircle2 size={22} />
          <p className="mt-2 text-xs font-bold">Complete</p>
          <h2 className="font-heading text-3xl font-black">{completed}</h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <RotateCcw size={22} />
          <p className="mt-2 text-xs font-bold">Revision</p>
          <h2 className="font-heading text-3xl font-black">{revision}</h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <Clock size={22} />
          <p className="mt-2 text-xs font-bold">Remaining</p>
          <h2 className="font-heading text-3xl font-black">{remaining}</h2>
        </div>
      </div>

      {/* TOPIC HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-black">Topics</h2>
          <p className="text-sm font-semibold opacity-70">
            {topics.length} Topics • {important} Important
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="neo-button bg-black px-4 py-2 text-white"
        >
          <div className="flex items-center gap-2">
            <Plus size={18} />
            Add Topic
          </div>
        </button>
      </div>

      {/* TOPIC LIST */}
      <section className="space-y-4">
        {topics.length === 0 ? (
          <div className="neo-card bg-white p-10 text-center">
            <BookOpen size={40} className="mx-auto mb-4" />

            <h3 className="font-heading text-2xl font-black">No Topics Yet</h3>

            <p className="mt-2 text-sm opacity-70">
              Create your first learning topic for this day.
            </p>

            <button
              onClick={() => setOpenModal(true)}
              className="neo-button mt-6 bg-black px-5 py-3 text-white"
            >
              Add First Topic
            </button>
          </div>
        ) : (
          topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} onRefresh={fetchData} />
          ))
        )}
      </section>

      {/* ================= ADD TOPIC MODAL ================= */}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="neo-card w-full max-w-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl font-black">
                Add Learning Topic
              </h2>

              <button
                onClick={() => setOpenModal(false)}
                className="neo-button bg-white px-3 py-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-black">
                  Topic Title
                </label>

                <input
                  value={topicForm.title}
                  onChange={(e) =>
                    setTopicForm({
                      ...topicForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="Streams"
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-black">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={topicForm.description}
                  onChange={(e) =>
                    setTopicForm({
                      ...topicForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Readable & Writable Streams"
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3"
                />
              </div>

              {/* Video */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <Video size={16} />
                  YouTube URL
                </label>

                <input
                  value={topicForm.videoUrl}
                  onChange={(e) =>
                    setTopicForm({
                      ...topicForm,
                      videoUrl: e.target.value,
                    })
                  }
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3"
                />
              </div>

              {/* Article */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <FileText size={16} />
                  Article URL
                </label>

                <input
                  value={topicForm.articleUrl}
                  onChange={(e) =>
                    setTopicForm({
                      ...topicForm,
                      articleUrl: e.target.value,
                    })
                  }
                  placeholder="https://nodejs.org/..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3"
                />
              </div>

              {/* Notes */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <StickyNote size={16} />
                  Personal Notes
                </label>

                <textarea
                  rows={4}
                  value={topicForm.notes}
                  onChange={(e) =>
                    setTopicForm({
                      ...topicForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Important interview notes..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3"
                />
              </div>

              {/* Important */}

              <label className="bg-yellow flex items-center gap-3 rounded-xl border-[3px] border-black px-4 py-3">
                <input
                  type="checkbox"
                  checked={topicForm.important}
                  onChange={(e) =>
                    setTopicForm({
                      ...topicForm,
                      important: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />

                <Star size={18} />

                <span className="font-black">Mark as Important</span>
              </label>
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
                disabled={saving}
                onClick={handleCreateTopic}
                className="neo-button bg-black px-6 py-3 text-white"
              >
                {saving ? "Creating..." : "Create Topic"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
