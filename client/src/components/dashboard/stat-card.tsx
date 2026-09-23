interface Props {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, color, icon }: Props) {
  return (
    <div className={`neo-card ${color} p-5`}>
      <div>{icon}</div>

      <p className="mt-3 text-xs font-semibold uppercase">{title}</p>

      <h2 className="font-heading mt-2 text-4xl font-bold">{value}</h2>
    </div>
  );
}
