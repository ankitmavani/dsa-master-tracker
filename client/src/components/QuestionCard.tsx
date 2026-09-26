import { useState } from "react";
import {
  CheckCircle2,
  Pencil,
  Trash2,
  ExternalLink,
  StickyNote,
  X,
  RotateCcw,
} from "lucide-react";

import { questionApi } from "@/services/question.service";
import type { Question } from "@/pages/ProblemDayPage";

interface Props {
  question: Question;
  onRefresh: () => void;
}

export default function QuestionCard({ question, onRefresh }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: question.title,
    description: question.description,
    leetcodeUrl: question.leetcodeUrl,
    gfgUrl: question.gfgUrl,
    difficulty: question.difficulty,
    tags: question.tags.join(", "),
    notes: question.notes,
  });

  const updateStatus = async (status: "pending" | "complete" | "revision") => {
    await questionApi.updateStatus(question.id, status);
    onRefresh();
  };

  const saveQuestion = async () => {
    try {
      setSaving(true);

      await questionApi.update(question.id, {
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
      });

      setEditing(false);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async () => {
    const ok = window.confirm("Delete this question?");

    if (!ok) return;

    await questionApi.delete(question.id);

    onRefresh();
  };

  const difficultyColor = {
    Easy: "bg-green",
    Medium: "bg-yellow",
    Hard: "bg-pink",
  };

  return (
    <>
      <div className="neo-card bg-white p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={() =>
              updateStatus(
                question.status === "complete" ? "pending" : "complete",
              )
            }
            className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-black ${
              question.status === "complete" ? "bg-green" : "bg-white"
            }`}
          >
            {question.status === "complete" && <CheckCircle2 size={16} />}
          </button>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-heading text-xl font-black ${
                  question.status === "complete"
                    ? "line-through opacity-60"
                    : ""
                }`}
              >
                {question.title}
              </h3>

              <span
                className={`rounded-full border-2 border-black px-2 py-0.5 text-xs font-black ${
                  difficultyColor[question.difficulty]
                }`}
              >
                {question.difficulty}
              </span>
            </div>

            <p className="mt-2 text-sm opacity-70">{question.description}</p>

            {question.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border-2 border-black bg-gray-100 px-2 py-1 text-xs font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {(question.leetcodeUrl || question.gfgUrl) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {question.leetcodeUrl && (
                  <a
                    href={question.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-yellow flex items-center gap-1 rounded-lg border-2 border-black px-3 py-2 text-xs font-black"
                  >
                    LeetCode
                    <ExternalLink size={12} />
                  </a>
                )}

                {question.gfgUrl && (
                  <a
                    href={question.gfgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green flex items-center gap-1 rounded-lg border-2 border-black px-3 py-2 text-xs font-black"
                  >
                    GFG
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {question.notes && (
              <div className="mt-4 rounded-xl border-2 border-black bg-gray-100 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-black">
                  <StickyNote size={14} />
                  NOTES
                </div>

                <p className="text-sm whitespace-pre-wrap">{question.notes}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {question.status === "complete" && (
                <span className="bg-green rounded-full border-2 border-black px-3 py-1 text-xs font-black">
                  ✅ Completed
                </span>
              )}

              {question.status === "revision" && (
                <span className="bg-pink rounded-full border-2 border-black px-3 py-1 text-xs font-black">
                  🔁 Revision
                </span>
              )}

              {question.status === "pending" && (
                <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black">
                  ⏳ Pending
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* COMPLETE */}
            <button
              onClick={() =>
                updateStatus(
                  question.status === "complete" ? "pending" : "complete",
                )
              }
              className={`neo-button px-3 py-2 text-xs ${
                question.status === "complete" ? "bg-green" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 size={14} />
                Complete
              </div>
            </button>

            {/* REVISION */}
            <button
              onClick={() =>
                updateStatus(
                  question.status === "revision" ? "pending" : "revision",
                )
              }
              className={`neo-button px-3 py-2 text-xs ${
                question.status === "revision" ? "bg-pink" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <RotateCcw size={14} />
                Revision
              </div>
            </button>

            {/* EDIT */}
            <button
              onClick={() => setEditing(true)}
              className="neo-button bg-white p-2"
            >
              <Pencil size={16} />
            </button>

            {/* DELETE */}
            <button
              onClick={deleteQuestion}
              className="neo-button bg-white p-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="neo-card w-full max-w-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl font-black">
                Edit Question
              </h2>

              <button
                onClick={() => setEditing(false)}
                className="neo-button bg-white p-2"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Question title"
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
                value={form.leetcodeUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leetcodeUrl: e.target.value,
                  })
                }
                placeholder="LeetCode URL"
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />

              <input
                value={form.gfgUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gfgUrl: e.target.value,
                  })
                }
                placeholder="GeeksForGeeks URL"
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
                  value={form.tags}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tags: e.target.value,
                    })
                  }
                  placeholder="array, hash"
                  className="rounded-xl border-[3px] border-black px-4 py-3"
                />
              </div>

              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                placeholder="Personal Notes"
                className="w-full rounded-xl border-[3px] border-black px-4 py-3"
              />
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
                onClick={saveQuestion}
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
