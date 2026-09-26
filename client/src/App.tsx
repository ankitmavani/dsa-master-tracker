import { Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/main-layout";

import DashboardPage from "@/pages/dashboard";
// import RoadmapPage from "@/pages/RoadmapPage.tsx";

// import ProblemRoadmapPage from "@/pages/ProblemRoadmapPage.tsx";
import ProblemDayPage from "@/pages/ProblemDayPage.tsx";
import RandomPage from "@/pages/random";

// import LearningRoadmapPage from "@/pages/LearningRoadmap.tsx";
// import LearningDayPage from "@/pages/LearningDayPage.tsx";
import RoadmapPage from "./pages/RoadmapPage.tsx";
import LearningRoadmapPage from "./pages/LearningRoadmap.tsx";
import LearningDayPage from "./pages/LearningDayPage.tsx";
import ProblemRoadmapPage from "./pages/ProblemRoadmapPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Roadmap Home */}
        <Route path="/roadmaps" element={<RoadmapPage />} />

        {/* Problem Roadmaps */}
        <Route path="/problem/:roadmapId" element={<ProblemRoadmapPage />} />

        <Route
          path="/problem/:roadmapId/day/:dayId"
          element={<ProblemDayPage />}
        />

        <Route path="/problem/:roadmapId/random" element={<RandomPage />} />

        {/* Learning Roadmaps */}
        <Route path="/learning/:roadmapId" element={<LearningRoadmapPage />} />

        <Route
          path="/learning/:roadmapId/day/:dayId"
          element={<LearningDayPage />}
        />
      </Route>
    </Routes>
  );
}
