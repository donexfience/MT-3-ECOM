import { UserRole } from "@/models/user";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  name: string;
  email: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

interface ITokenUser {
  _id: string;
  email: string;
  role: UserRole;
}

export class TokenManger {
  public generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "15m",
    });
  }

  public generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }

  public generateTokens(user: ITokenUser) {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    const userId = this.generateUserIdToken(payload.userId);

    return { accessToken, refreshToken ,userId };
  }
  public generateUserIdToken(userId: string) {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_USRID_SECRET!, {
      expiresIn: "7d",
    });
  }
}
