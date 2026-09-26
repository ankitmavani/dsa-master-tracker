import { Request, Response } from "express";
import { QuestionService } from "../services/question.service";

export class QuestionController {
  static async getByDay(req: any, res: Response) {
    const data = await QuestionService.getByDay(req.params.dayId);

    res.json({
      success: true,
      data,
    });
  }

  static async create(req: Request, res: Response) {
    const data = await QuestionService.create(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  }

  static async update(req: any, res: Response) {
    await QuestionService.update(req.params.id, req.body);

    res.json({
      success: true,
    });
  }

  static async updateStatus(req: any, res: Response) {
    await QuestionService.updateStatus(req.params.id, req.body.status);

    res.json({
      success: true,
    });
  }

  static async delete(req: any, res: Response) {
    await QuestionService.delete(req.params.id);

    res.json({
      success: true,
    });
  }
}
