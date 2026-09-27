import { Router } from "express";
import { upload } from "../config/upload";
import { RoadmapController } from "../controllers/roadmap.controller";

const router = Router();

router.get("/", RoadmapController.findAll);

router.get("/:id", RoadmapController.findById);

router.post("/", RoadmapController.create);

// Bulk Upload
router.post(
  "/bulk-upload",
  upload.single("file"),
  RoadmapController.bulkUpload,
);

router.put("/:id", RoadmapController.update);

router.delete("/:id", RoadmapController.delete);

export default router;
