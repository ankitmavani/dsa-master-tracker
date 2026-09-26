import { Request, Response } from "express";
import { DayService } from "../services/day.service";

export class DayController {
  static async getByRoadmap(req: any, res: Response) {
    const data = await DayService.getByRoadmap(req.params.roadmapId);

    res.json({
      success: true,
      data,
    });
  }

  static async create(req: Request, res: Response) {
    const { roadmapId, title } = req.body;

    const data = await DayService.create(roadmapId, title);

    res.status(201).json({
      success: true,
      data,
    });
  }

  static async update(req: any, res: Response) {
    await DayService.update(req.params.id, req.body.title);

    res.json({ success: true });
  }

  static async delete(req: any, res: Response) {
    await DayService.delete(req.params.id);

    res.json({ success: true });
  }

  static async reorder(req: Request, res: Response) {
    const { roadmapId, orderedIds } = req.body;

    await DayService.reorder(roadmapId, orderedIds);

    res.json({ success: true });
  }
}
