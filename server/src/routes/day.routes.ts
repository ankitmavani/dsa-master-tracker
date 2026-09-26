import { Router } from "express";
import { DayController } from "../controllers/day.controller";

const router = Router();

router.get("/roadmap/:roadmapId", DayController.getByRoadmap);

router.post("/", DayController.create);

router.put("/:id", DayController.update);

router.delete("/:id", DayController.delete);

router.patch("/reorder", DayController.reorder);

export default router;
