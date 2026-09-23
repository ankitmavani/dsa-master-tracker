import type { Question, QuestionStatus } from "@/types/question";
import { ExternalLink } from "lucide-react";

interface Props {
  question: Question;
  onStatus: (id: number, status: QuestionStatus) => void;
}

export default function QuestionCard({ question, onStatus }: Props) {
  return (
    <div className="neo-card bg-white p-5">
      <div className="mb-3 flex gap-2">
        <span className="bg-green rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
          {question.difficulty}
        </span>

        <span className="bg-blue rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
          {question.platform}
        </span>
      </div>

      <h3 className="font-heading text-xl font-bold">{question.title}</h3>

      <p className="mt-2 text-xs">
        Solved Random: {question.randomSolvedCount} times
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => onStatus(question.id, "complete")}
          className={`neo-button px-4 py-2 ${
            question.status === "complete" ? "bg-green" : "bg-white"
          }`}
        >
          Complete
        </button>

        <button
          onClick={() => onStatus(question.id, "revision")}
          className={`neo-button px-4 py-2 ${
            question.status === "revision" ? "bg-pink" : "bg-white"
          }`}
        >
          Revision
        </button>

        <button
          onClick={() => window.open(question.url, "_blank")}
          className="neo-button bg-black px-4 py-2 text-white"
        >
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
