import { Router } from "express";
import { BlogController } from "./blog.controller";

export class BlogRouter {
  router: Router;
  blogController: BlogController;

  constructor() {
    this.router = Router();
    this.blogController = new BlogController();
    this.initialRoutes();
  }

  private initialRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
  };

  getRouter = () => {
    return this.router;
  };
}
