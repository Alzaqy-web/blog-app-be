import { Prisma } from "../../generated/prisma";
import { ApiError } from "../../utils/api.error";
import { generateSlug } from "../../utils/generate-slug";
import { CloudinariService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBlogDTO } from "./dto/create-blog.dto";
import { GetBlogDTO } from "./dto/get-blog.dto";

export class BlogService {
  prisma: PrismaService;
  private cloudinaryService: CloudinariService;

  constructor() {
    this.prisma = new PrismaService();
    this.cloudinaryService = new CloudinariService();
  }
  getBlogs = async (query: GetBlogDTO) => {
    const { page, take, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.BlogWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }

    const blogs = await this.prisma.blog.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * take,
      take: take,
      include: { user: { omit: { password: true } } },
    });

    const count = await this.prisma.blog.count({ where: whereClause });

    return {
      data: blogs,
      meta: { page, take, total: count },
    };
  };

  getBlogBySlug = async (slug: string) => {
    const blog = await this.prisma.blog.findFirst({
      where: { slug, deletedAt: null },
      include: { user: { omit: { password: true } } }, //-> inculde -> join
    });

    if (!blog) {
      throw new ApiError("blog not found", 404);
    }

    return blog;
  };

  createBlog = async (
    body: CreateBlogDTO,
    thumbnail: Express.Multer.File,
    authUserId: number
  ) => {
    // cek
    const blog = await this.prisma.blog.findFirst({
      where: { title: body.title },
    });

    if (blog) {
      throw new ApiError("title already in use", 400);
    }

    const slug = generateSlug(body.title);

    const { secure_url } = await this.cloudinaryService.upload(thumbnail);

    await this.prisma.blog.create({
      data: {
        ...body,
        thumbnail: secure_url,
        userId: authUserId,
        slug,
      },
    });

    return { message: "create blog susscess" };
  };

  deteleBlog = async (id: number, authUserId: number) => {
    const blog = await this.prisma.blog.findFirst({
      // cari
      where: { id, deletedAt: null },
    });
    // jika tidak ada
    if (!blog) {
      throw new ApiError("blog not found", 404);
    }

    if (blog.userId !== authUserId) {
      throw new ApiError("unauthorized", 401);
    }

    await this.cloudinaryService.remove(blog.thumbnail);

    await this.prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "delelte blog sucssec" };
  };
}
