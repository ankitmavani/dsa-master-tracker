import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";

const router = Router();

router.get("/day/:dayId", QuestionController.getByDay);

router.post("/", QuestionController.create);

router.put("/:id", QuestionController.update);

router.patch("/:id/status", QuestionController.updateStatus);

router.delete("/:id", QuestionController.delete);

export default router;
