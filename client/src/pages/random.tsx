import { useMemo, useState } from "react";
import { Shuffle, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmaps } from "@/data/roadmaps";
import { useQuestions } from "@/hooks/use-questions";
import { useRandom } from "@/hooks/use-random";
import type { Question } from "@/types/question";

export default function RandomPage() {
  const navigate = useNavigate();
  const { roadmapId = "" } = useParams();

  const roadmap = roadmaps.find((r) => r.id === roadmapId);

  const { questions, updateStatus } = useQuestions();

  const { generate } = useRandom(roadmapId);

  const roadmapQuestions = useMemo(
    () => questions.filter((q) => q.roadmapId === roadmapId),
    [questions, roadmapId],
  );

  const [tab, setTab] = useState<"random" | "ai">("random");

  const [current, setCurrent] = useState<Question | null>(null);

  const generateQuestion = () => {
    const q = generate(roadmapQuestions);

    if (q) setCurrent(q);
  };

  const markComplete = () => {
    if (!current) return;

    updateStatus(current.id, "complete");

    setCurrent({
      ...current,
      status: "complete",
      randomSolvedCount: current.randomSolvedCount + 1,
    });
  };

  const markRevision = () => {
    if (!current) return;

    updateStatus(current.id, "revision");

    setCurrent({
      ...current,
      status: "revision",
      randomSolvedCount: current.randomSolvedCount + 1,
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/problem/${roadmapId}`)}
        className="neo-button bg-white px-4 py-2"
      >
        ← Back
      </button>

      <section className="neo-card bg-yellow p-6">
        <h1 className="font-heading text-4xl font-bold">{roadmap?.title}</h1>

        <p className="mt-2">Random Practice Engine</p>
      </section>

      <div className="flex gap-3">
        <button
          onClick={() => setTab("random")}
          className={`neo-button px-5 py-2 ${
            tab === "random" ? "bg-black text-white" : "bg-white"
          }`}
        >
          <Shuffle size={18} />
          Random
        </button>

        <button
          onClick={() => setTab("ai")}
          className={`neo-button px-5 py-2 ${
            tab === "ai" ? "bg-black text-white" : "bg-white"
          }`}
        >
          <Sparkles size={18} />
          AI Problem
        </button>
      </div>

      {tab === "ai" && (
        <div className="neo-card bg-blue p-10 text-center">
          <Sparkles size={40} className="mx-auto" />

          <h2 className="font-heading mt-4 text-3xl font-bold">Coming Soon</h2>

          <p className="mt-2">
            AI will generate a brand-new problem based on your completed
            roadmap.
          </p>
        </div>
      )}

      {tab === "random" && (
        <>
          <button
            onClick={generateQuestion}
            className="neo-button bg-yellow flex w-full items-center justify-center gap-2 py-4"
          >
            <Shuffle size={20} />
            Generate Random Question
          </button>

          {current && (
            <div className="neo-card space-y-5 bg-white p-6">
              <div className="flex gap-2">
                <span className="bg-green rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
                  {current.difficulty}
                </span>

                <span className="bg-blue rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
                  {current.platform}
                </span>
              </div>

              <h2 className="font-heading text-3xl font-bold">
                {current.title}
              </h2>

              <p className="font-medium">Day {current.day}</p>

              <div className="bg-pink rounded-lg border-[3px] border-black p-3 font-bold">
                Solved Random : {current.randomSolvedCount} Times
              </div>

              <button
                onClick={() => window.open(current.url, "_blank")}
                className="neo-button w-full bg-black py-3 text-white"
              >
                OPEN QUESTION ↗
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={markComplete}
                  className="neo-button bg-green py-3"
                >
                  Complete
                </button>

                <button
                  onClick={markRevision}
                  className="neo-button bg-pink py-3"
                >
                  Revision
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
