import { JWT_SECRET } from "../../config/env";
import { User } from "../../generated/prisma";
import { ApiError } from "../../utils/api.error";
import { PrismaService } from "../prisma/prisma.service";
import { PasswordService } from "./password.service";
import { tokenService } from "./token.service";

export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;
  private tokenService: tokenService;

  constructor() {
    this.prisma = new PrismaService();
    this.passwordService = new PasswordService();
    this.tokenService = new tokenService();
  }
  login = async (body: Pick<User, "email" | "password">) => {
    // cek dulu email ada gak di db
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    // kalau gak ada thorw error
    if (!user) {
      throw new ApiError("email not found", 400);
    }

    // kalo ada cek passsword valod or tidak
    const isPasswordValid = await this.passwordService.comparePassword(
      body.password,
      user.password
    );

    // kalo tidak valit thorw error
    if (!isPasswordValid) {
      throw new ApiError("invalid password", 400);
    }

    // kalo valid generate access token mengunakan jwt
    const accessToken = this.tokenService.generateToken(
      {
        id: user.id,
      },
      JWT_SECRET!
    );

    const { password, ...userWhithoutPassword } = user;

    // return data user berserta tokennya
    return { ...userWhithoutPassword, accessToken };
  };
}
