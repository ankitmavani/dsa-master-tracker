import { useState } from "react";
import {
  CheckCircle2,
  RotateCcw,
  Star,
  Pencil,
  Trash2,
  Video,
  FileText,
  StickyNote,
  ExternalLink,
  X,
} from "lucide-react";

import { itemApi } from "@/services/item.service";
import type { Topic } from "@/pages/LearningDayPage";

interface Props {
  topic: Topic;
  onRefresh: () => void;
}

export default function TopicCard({ topic, onRefresh }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: topic.title,
    description: topic.description,
    videoUrl: topic.videoUrl,
    articleUrl: topic.articleUrl,
    notes: topic.notes,
    important: topic.flags.important,
  });

  const toggleComplete = async () => {
    await itemApi.updateFlags(topic.id, {
      ...topic.flags,
      completed: !topic.flags.completed,
    });

    onRefresh();
  };

  const toggleRevision = async () => {
    await itemApi.updateFlags(topic.id, {
      ...topic.flags,
      revision: !topic.flags.revision,
    });

    onRefresh();
  };

  const saveTopic = async () => {
    try {
      setSaving(true);

      await itemApi.update(topic.id, {
        title: form.title,
        description: form.description,
        videoUrl: form.videoUrl,
        articleUrl: form.articleUrl,
        notes: form.notes,
        flags: {
          ...topic.flags,
          important: form.important,
        },
      });

      setEditing(false);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const deleteTopic = async () => {
    const ok = window.confirm("Delete this topic?");

    if (!ok) return;

    await itemApi.delete(topic.id);

    onRefresh();
  };

  return (
    <>
      <div className="neo-card bg-white p-5">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={topic.flags.completed}
            onChange={toggleComplete}
            className="mt-1 h-6 w-6 accent-black"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-heading text-xl font-black ${
                  topic.flags.completed ? "line-through opacity-50" : ""
                }`}
              >
                {topic.title}
              </h3>

              {topic.flags.important && (
                <span className="bg-yellow rounded-full border-2 border-black px-2 py-0.5 text-xs font-bold">
                  ⭐ Important
                </span>
              )}
            </div>

            <p className="mt-2 text-sm opacity-70">{topic.description}</p>

            {(topic.videoUrl || topic.articleUrl) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {topic.videoUrl && (
                  <a
                    href={topic.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-lg border-2 border-black bg-red-100 px-3 py-1 text-xs font-bold"
                  >
                    <Video size={13} />
                    YouTube
                    <ExternalLink size={11} />
                  </a>
                )}

                {topic.articleUrl && (
                  <a
                    href={topic.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-lg border-2 border-black bg-blue-100 px-3 py-1 text-xs font-bold"
                  >
                    <FileText size={13} />
                    Article
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            )}

            {topic.notes && (
              <div className="mt-4 rounded-xl border-2 border-black bg-gray-100 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-black">
                  <StickyNote size={14} />
                  NOTES
                </div>

                <p className="text-sm whitespace-pre-wrap">{topic.notes}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {topic.flags.completed && (
                <span className="bg-green rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
                  <CheckCircle2 size={12} className="mr-1 inline" />
                  Completed
                </span>
              )}

              {topic.flags.revision && (
                <span className="bg-pink rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
                  <RotateCcw size={12} className="mr-1 inline" />
                  Revision
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={toggleRevision}
              className={`neo-button px-3 py-2 text-xs ${
                topic.flags.revision ? "bg-pink" : "bg-white"
              }`}
            >
              Revision
            </button>

            <button
              onClick={() => setEditing(true)}
              className="neo-button bg-white p-2"
            >
              <Pencil size={16} />
            </button>

            <button onClick={deleteTopic} className="neo-button bg-white p-2">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="neo-card w-full max-w-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl font-black">Edit Topic</h2>

              <button
                onClick={() => setEditing(false)}
                className="neo-button bg-white p-2"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <input
                value={form.videoUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    videoUrl: e.target.value,
                  })
                }
                placeholder="YouTube URL"
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <input
                value={form.articleUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    articleUrl: e.target.value,
                  })
                }
                placeholder="Article URL"
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Personal Notes"
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <label className="bg-yellow flex items-center gap-3 rounded-xl border-[3px] border-black px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.important}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      important: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />

                <Star size={18} />
                <span className="font-black">Important Topic</span>
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="neo-button bg-white px-5 py-3"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={saveTopic}
                className="neo-button bg-black px-6 py-3 text-white"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
