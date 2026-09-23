import { useNavigate } from "react-router-dom";

interface Props {
  roadmapId: string;
  day: number;
  title: string;
  completed: boolean;
}

export default function DayCard({ roadmapId, day, title, completed }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/problem/${roadmapId}/day/${day}`)}
      className={`neo-card w-full p-4 text-left transition hover:-translate-y-1 ${
        completed ? "bg-green" : "bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="bg-yellow rounded-lg border-[3px] border-black px-3 py-1 font-bold">
          {String(day).padStart(2, "0")}
        </span>

        {completed ? "✅" : "📚"}
      </div>

      <h3 className="font-heading font-bold">Day {day}</h3>

      <p className="mt-1 text-sm opacity-70">{title}</p>
    </button>
  );
}
