type Props = {
  title: string;
  value: string;
  color: string;
};

export default function StatsCard({ title, value, color }: Props) {
  return (
    <div className={`neo-card ${color} p-4`}>
      <p className="text-sm font-semibold">{title}</p>

      <h2 className="font-heading mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}