import { useNavigate } from "react-router-dom";

type Props = {
  day: {
    day: number;
    topic: string;
    completed: boolean;
    revision: boolean;
  };
};

export default function DayGridCard({ day }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/problem/dsa/day/${day.day}`)}
      className={`neo-card w-full p-4 text-left transition hover:-translate-y-1 ${
        day.completed ? "bg-green" : "bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="bg-yellow rounded-lg border-[3px] border-black px-3 py-1 font-bold">
          {String(day.day).padStart(2, "0")}
        </div>

        {day.completed ? (
          <span className="text-xl">✅</span>
        ) : day.revision ? (
          <span className="text-xl">🔁</span>
        ) : (
          <span className="text-xl">📚</span>
        )}
      </div>

      <h3 className="font-heading text-lg font-bold">Day {day.day}</h3>

      <p className="mt-1 text-sm opacity-70">{day.topic}</p>
    </button>
  );
}
