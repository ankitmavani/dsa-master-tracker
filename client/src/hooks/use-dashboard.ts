import { roadmaps } from "@/data/roadmaps";
import { days } from "@/data/days";
import { useQuestions } from "@/hooks/use-questions";
import { useLearning } from "@/hooks/use-learning";

export function useDashboard() {
  const { questions } = useQuestions();
  const { topics } = useLearning();

  const totalQuestions = questions.length;
  const completedQuestions = questions.filter(
    (q) => q.status === "complete",
  ).length;
  const revisionQuestions = questions.filter(
    (q) => q.status === "revision",
  ).length;

  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.completed).length;
  const revisionTopics = topics.filter((t) => t.revision).length;

  const roadmapProgress = roadmaps.map((roadmap) => {
    if (roadmap.type === "problem") {
      const roadmapDays = days.filter((d) => d.roadmapId === roadmap.id);

      const completedDays = roadmapDays.filter((day) => {
        const list = questions.filter(
          (q) => q.roadmapId === roadmap.id && q.day === day.day,
        );

        return list.length > 0 && list.every((q) => q.status === "complete");
      }).length;

      return {
        ...roadmap,
        completed: completedDays,
      };
    }

    const roadmapDays = days.filter((d) => d.roadmapId === roadmap.id);

    const completedDays = roadmapDays.filter((day) => {
      const list = topics.filter(
        (t) => t.roadmapId === roadmap.id && t.day === day.day,
      );

      return list.length > 0 && list.every((t) => t.completed);
    }).length;

    return {
      ...roadmap,
      completed: completedDays,
    };
  });

  return {
    totalQuestions,
    completedQuestions,
    revisionQuestions,

    totalTopics,
    completedTopics,
    revisionTopics,

    roadmapProgress,
  };
}
