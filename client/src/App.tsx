import { Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/main-layout";

import DashboardPage from "@/pages/dashboard";
import RoadmapPage from "@/pages/roadmap";

import ProblemRoadmapPage from "@/pages/problem-roadmap";
import ProblemDayPage from "@/pages/problem-day";
import RandomPage from "@/pages/random";

import LearningRoadmapPage from "@/pages/learning-roadmap";
import LearningDayPage from "@/pages/learning-day";

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
