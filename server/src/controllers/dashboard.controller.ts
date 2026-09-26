import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
  static async getDashboard(req: Request, res: Response) {
    const data = await DashboardService.getDashboard();

    res.json({
      success: true,
      data,
    });
  }
}
