import { useState } from "react";
import { ArrowLeft, Shuffle, ExternalLink } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useProblem } from "@/hooks/use-problem";
import { useRandom } from "@/hooks/use-random";

import type { Question } from "@/types/problem";

export default function RandomPage() {
  const navigate = useNavigate();

  const { roadmapId = "" } = useParams();

  const { roadmap, getAllQuestions, increaseRandomSolved } =
    useProblem(roadmapId);

  const { generate, resetHistory } = useRandom(roadmapId);

  const [question, setQuestion] = useState<Question | null>(null);

  if (!roadmap) return <div>Roadmap not found</div>;

  const handleGenerate = () => {
    const q = generate(getAllQuestions());

    if (q) {
      increaseRandomSolved(q.id);
      setQuestion(q);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/problem/${roadmapId}`)}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <section className="neo-card bg-blue p-6 text-center">
        <Shuffle size={52} className="mx-auto" />

        <h1 className="font-heading mt-4 text-4xl font-bold">
          {roadmap.title}
        </h1>

        <p className="mt-2">Priority: Revision → Complete</p>

        <button
          onClick={handleGenerate}
          className="neo-button bg-yellow mt-6 px-8 py-3"
        >
          Generate Question
        </button>

        <button
          onClick={resetHistory}
          className="neo-button mt-3 bg-white px-6 py-2"
        >
          Reset Cycle
        </button>
      </section>

      {question && (
        <div className="neo-card bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="bg-yellow rounded-lg border-[3px] border-black px-3 py-1 text-sm font-bold">
              {question.difficulty}
            </span>

            <span className="font-semibold uppercase">{question.platform}</span>
          </div>

          <h2 className="font-heading text-3xl font-bold">{question.title}</h2>

          <p className="mt-3 text-sm">
            Random Solved: {question.randomSolvedCount}
          </p>

          <a
            href={question.url}
            target="_blank"
            className="neo-button bg-green mt-6 inline-flex items-center gap-2 px-5 py-3"
            rel="noreferrer"
          >
            Solve Now
            <ExternalLink size={18} />
          </a>
        </div>
      )}
    </div>
  );
}
