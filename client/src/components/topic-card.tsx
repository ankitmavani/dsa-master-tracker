import { CheckCircle2, RotateCcw } from "lucide-react";
import type { LearningTopic } from "@/types/learning";

interface Props {
  topic: LearningTopic;
  onComplete: (id: number) => void;
  onRevision: (id: number) => void;
}

export default function TopicCard({ topic, onComplete, onRevision }: Props) {
  return (
    <div className="neo-card bg-white p-5">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={topic.completed}
          onChange={() => onComplete(topic.id)}
          className="mt-1 h-6 w-6 accent-black"
        />

        <div className="flex-1">
          <h3
            className={`font-heading text-xl font-bold ${
              topic.completed ? "line-through opacity-60" : ""
            }`}
          >
            {topic.title}
          </h3>

          <p className="mt-1 text-sm opacity-70">{topic.description}</p>

          <div className="mt-3 flex gap-2">
            {topic.completed && (
              <span className="bg-green rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
                <CheckCircle2 size={12} className="mr-1 inline" />
                Completed
              </span>
            )}

            {topic.revision && (
              <span className="bg-pink rounded-full border-2 border-black px-3 py-1 text-xs font-bold">
                <RotateCcw size={12} className="mr-1 inline" />
                Revision
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onRevision(topic.id)}
          className={`neo-button px-3 py-2 ${
            topic.revision ? "bg-pink" : "bg-white"
          }`}
        >
          Revision
        </button>
      </div>
    </div>
  );
}
