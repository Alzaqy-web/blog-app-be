import { NextFunction, Request, Response } from "express";
import { BlogService } from "./blog.service";
import { plainToInstance } from "class-transformer";
import { GetBlogDTO } from "./dto/get-blog.dto";
import { ApiError } from "../../utils/api.error";

export class BlogController {
  blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = plainToInstance(GetBlogDTO, req.query);
      const result = await this.blogService.getBlogs(query);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug;
      const result = await this.blogService.getBlogBySlug(slug);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  createBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const thumbnail = files.thumbnail?.[0];

      if (!thumbnail) throw new ApiError("thumbnail is required", 400);

      const userId: number = res.locals.user.id;

      const result = await this.blogService.createBlog(
        req.body,
        thumbnail,
        userId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const authUserId = Number(res.locals.user.id);
      const result = await this.blogService.deteleBlog(id, authUserId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
