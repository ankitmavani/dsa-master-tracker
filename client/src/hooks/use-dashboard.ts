import { useEffect, useState } from "react";
import { dashboardApi } from "@/services/dashboard.service";

export function useDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    completedQuestions: 0,
    revisionQuestions: 0,
    completedTopics: 0,
    totalQuestions: 0,
    totalTopics: 0,
    totalItems: 0,
    overallProgress: 0,
  });

  const [roadmapProgress, setRoadmapProgress] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await dashboardApi.get();

      setStats(res.data.stats);
      setRoadmapProgress(res.data.roadmaps);

      setLoading(false);
    };

    load();
  }, []);

  return {
    loading,
    roadmapProgress,
    ...stats,
  };
}
