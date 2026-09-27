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

// roadmap.routes.ts

router.post("/:id/playlists", RoadmapController.addPlaylist);

router.post("/:id/books", RoadmapController.addBook);

router.post("/:id/notes", RoadmapController.addNote);

// router.delete("/:id/playlists/:playlistId", RoadmapController.deletePlaylist);

// router.delete("/:id/books/:bookId", RoadmapController.deleteBook);

// router.delete("/:id/notes/:noteId", RoadmapController.deleteNote);

export default router;
