import { Prisma } from "../../generated/prisma";
import { PrismaService } from "../prisma/prisma.service";
import { GetBlogDTO } from "./dto/get-blog.dto";

export class BlogService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
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
}
