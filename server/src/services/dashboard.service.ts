import { db } from "../config/firebase";

export class DashboardService {
  static async getDashboard() {
    const [roadmaps, days, items, questions] = await Promise.all([
      db.collection("roadmaps").get(),
      db.collection("days").get(),
      db.collection("items").get(),
      db.collection("questions").get(),
    ]);

    const roadmapList = roadmaps.docs.map((d) => d.data());
    const dayList = days.docs.map((d) => d.data());

    const learning = items.docs.map((d) => d.data());
    const dsa = questions.docs.map((d) => d.data());

    const completedQuestions = dsa.filter(
      (q: any) => q.status === "complete",
    ).length;

    const revisionQuestions = dsa.filter(
      (q: any) => q.status === "revision",
    ).length;

    const completedTopics = learning.filter(
      (t: any) => t.flags?.completed,
    ).length;

    const roadmapProgress = roadmapList.map((roadmap: any) => {
      const roadmapDays = dayList.filter(
        (d: any) => d.roadmapId === roadmap.id,
      );

      let completed = 0;

      roadmapDays.forEach((day: any) => {
        if (roadmap.type === "problem") {
          const list = dsa.filter((q: any) => q.dayId === day.id);

          if (
            list.length > 0 &&
            list.every((q: any) => q.status === "complete")
          ) {
            completed++;
          }
        } else {
          const list = learning.filter((t: any) => t.dayId === day.id);

          if (list.length > 0 && list.every((t: any) => t.flags.completed)) {
            completed++;
          }
        }
      });

      return {
        id: roadmap.id,
        title: roadmap.title,
        type: roadmap.type,
        color: roadmap.color,
        completed,
        totalDays: roadmap.totalDays,
        progress:
          roadmap.totalDays === 0
            ? 0
            : Math.round((completed / roadmap.totalDays) * 100),
      };
    });

    const totalQuestions = dsa.length;
    const totalTopics = learning.length;

    return {
      stats: {
        completedQuestions,
        revisionQuestions,
        completedTopics,
        totalQuestions,
        totalTopics,
        totalItems: totalQuestions + totalTopics,
        overallProgress:
          totalQuestions + totalTopics === 0
            ? 0
            : Math.round(
                ((completedQuestions + completedTopics) /
                  (totalQuestions + totalTopics)) *
                  100,
              ),
      },

      roadmaps: roadmapProgress,
    };
  }
}
