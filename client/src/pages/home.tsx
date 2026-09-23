// import Header from "@/components/layout/header";
// import StatsCard from "@/components/layout/stats-card";
// import DayCard from "@/components/layout/day-card";
import DayCard from "@/components/layout/day-card";
// import Header from "@/components/layout/header";
import StatsCard from "@/components/layout/stats-card";
import { days } from "@/data/days";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* <Header /> */}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard title="Completed" value="12" color="bg-green" />
        <StatsCard title="Revision" value="4" color="bg-pink" />
        <StatsCard title="Streak" value="7" color="bg-blue" />
        <StatsCard title="Progress" value="20%" color="bg-white" />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold">All Days</h2>

          <div className="rounded-full border-[3px] border-black bg-white px-4 py-2 font-bold">
            60
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {days.map((item) => (
            <DayCard key={item.id} day={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
