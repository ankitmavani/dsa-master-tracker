import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { questions } from "@/data/questions";

export default function RandomPage() {
  const { roadmapId } = useParams();

  const roadmapQuestions = useMemo(
    () => questions.filter((q) => q.roadmapId === roadmapId),
    [roadmapId],
  );

  return (
    <>
      <h1>{roadmapId} Random</h1>

      {roadmapQuestions.length}
    </>
  );
}
