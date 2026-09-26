import { Request, Response } from "express";
import { ItemService } from "../services/item.service";

export class ItemController {
  static async create(req: Request, res: Response) {
    try {
      const data = await ItemService.create(req.body);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  }

  static async getByDay(req: any, res: Response) {
    const data = await ItemService.findByDay(req.params.dayId);

    res.json({
      success: true,
      data,
    });
  }

  static async update(req: any, res: Response) {
    await ItemService.update(req.params.id, req.body);

    res.json({
      success: true,
    });
  }

  static async updateFlags(req: any, res: Response) {
    await ItemService.updateFlags(req.params.id, req.body);

    res.json({
      success: true,
    });
  }

  static async delete(req: any, res: Response) {
    await ItemService.delete(req.params.id);

    res.json({
      success: true,
    });
  }
}
