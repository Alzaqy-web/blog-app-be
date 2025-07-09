import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // getSamples = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const result = await this.authService.getSamples();
  //     res.status(200).send(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
