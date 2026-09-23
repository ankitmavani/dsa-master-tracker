interface Props {
  title: string;
  completed: number;
  total: number;
  color: string;
}

export default function RoadmapProgress({
  title,
  completed,
  total,
  color,
}: Props) {
  const progress = (completed / total) * 100;

  return (
    <div className={`neo-card ${color} p-5`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold">{title}</h3>

        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 font-bold">
          {completed}/{total}
        </span>
      </div>

      <div className="h-4 rounded-full border-[3px] border-black bg-white">
        <div
          className="h-full rounded-full bg-black transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
