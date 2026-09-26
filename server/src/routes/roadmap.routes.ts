import { Router } from "express";
import { RoadmapController } from "../controllers/roadmap.controller";

const router = Router();

router.post("/", RoadmapController.create);

router.get("/", RoadmapController.findAll);

router.get("/:id", RoadmapController.findById);

router.put("/:id", RoadmapController.update);

router.delete("/:id", RoadmapController.delete);

export default router;
