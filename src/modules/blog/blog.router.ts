import { Router } from "express";
import { BlogController } from "./blog.controller";
import { UploaderMiddleware } from "../../middlewares/uploder.middleware";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateBlogDTO } from "./dto/create-blog.dto";

export class BlogRouter {
  private router: Router;
  private blogController: BlogController;
  private jwtMiddleware: JwtMiddleware;
  private uploaderMiddleware: UploaderMiddleware;

  constructor() {
    this.router = Router();
    this.blogController = new BlogController();
    this.jwtMiddleware = new JwtMiddleware();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.initialRoutes();
  }

  private initialRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      this.uploaderMiddleware
        .uploud()
        .fields([{ name: "thumbnail", maxCount: 1 }]),
      this.uploaderMiddleware.fileFilter([
        "image/jpeg",
        "image/png",
        "image/apng",
      ]),
      validateBody(CreateBlogDTO),
      this.blogController.createBlogs
    );
  };

  getRouter = () => {
    return this.router;
  };
}
