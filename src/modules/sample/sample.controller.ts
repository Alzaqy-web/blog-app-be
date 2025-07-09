import { NextFunction, Request, Response } from "express";
import { SampleService } from "./sample.service";

export class SampleController {
  private sampleService: SampleService;

  constructor() {
    this.sampleService = new SampleService();
  }

  getSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await this.sampleService.getSample(id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
