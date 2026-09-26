import { Router } from "express";
import { ItemController } from "../controllers/item.controller";

const router = Router();

router.post("/", ItemController.create);

router.get("/day/:dayId", ItemController.getByDay);

router.put("/:id", ItemController.update);

router.patch("/:id/flags", ItemController.updateFlags);

router.delete("/:id", ItemController.delete);

export default router;
