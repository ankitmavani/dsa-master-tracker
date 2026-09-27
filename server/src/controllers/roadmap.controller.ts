import { Request, Response } from "express";
import { ExcelService } from "../services/excel.service";
import { RoadmapService } from "../services/roadmap.service";

export class RoadmapController {
  static async create(req: Request, res: Response) {
    try {
      const data = await RoadmapService.create(req.body);

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

  static async bulkUpload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Excel file required",
        });
      }

      const rows = ExcelService.parse(req.file.buffer);

      const data = await RoadmapService.bulkCreate({
        roadmap: req.body,
        rows,
      });

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

  static async findAll(_: Request, res: Response) {
    const data = await RoadmapService.findAll();

    res.json({
      success: true,
      data,
    });
  }

  static async findById(req: any, res: Response) {
    const data = await RoadmapService.findById(req.params.id);

    res.json({
      success: true,
      data,
    });
  }

  static async update(req: any, res: Response) {
    await RoadmapService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: "Roadmap updated",
    });
  }

  static async delete(req: any, res: Response) {
    await RoadmapService.delete(req.params.id);

    res.json({
      success: true,
      message: "Roadmap deleted",
    });
  }
}
