import { Request, Response } from "express";
import User, { IUser, UserRole } from "../models/user";
import bcrypt from "bcryptjs";
import { TokenManger } from "../utils/token";
import { HttpCode } from "../utils/constants";
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

export class AuthController {
  private TokenManger: TokenManger;
  constructor() {
    this.TokenManger = new TokenManger();
  }
  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Name, email, and password are required",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Please provide a valid email address",
        });
        return;
      }

      if (password.length < 6) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
        return;
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { name }],
      });

      if (existingUser) {
        res.status(HttpCode.CONFLICT).json({
          success: false,
          message: "User with this email or username already exists",
        });
        return;
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      });

      const { accessToken, refreshToken } = this.TokenManger.generateTokens({
        _id: newUser?._id as string,
        email: newUser.email,
        role: newUser.role,
      });

      newUser.refreshToken = refreshToken;
      await newUser.save();

      const userResponse = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      const userId = this.TokenManger.generateUserIdToken(
        String(userResponse.id)
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 60 * 1000,
      });

      res.cookie("userId", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpCode.CREATED).json({
        success: true,
        data: {
          user: userResponse,
          accessToken,
        },
        message: "User created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create user");
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        res.status(HttpCode.UNAUTHORIZED).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      const { accessToken, refreshToken } = this.TokenManger.generateTokens({
        _id: user?._id as string,
        email: user.email,
        role: user.role,
      });

      user.refreshToken = refreshToken;
      await user.save();

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const userId = this.TokenManger.generateUserIdToken(
        userResponse.id as string
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 60 * 1000,
      });

      res.cookie("userId", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          user: userResponse,
          accessToken,
        },
        message: "Login successful",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to login");
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.cookies;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "UserId not provided",
        });
        return;
      }

      const decoded = jwt.verify(
        userId,
        process.env.JWT_USRID_SECRET!
      ) as TokenPayload;
      console.log("decoded user in the refresh enpoint", decoded);

      const user = await User.findOne({
        _id: decoded.userId,
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid userId token",
        });
        return;
      }

      const {
        accessToken,
        refreshToken: newRefreshToken,
        userId: newUserId,
      } = this.TokenManger.generateTokens({
        _id: (user._id as string).toString(),
        email: user.email,
        role: user.role,
      });
      user.refreshToken = newRefreshToken;
      await user.save();
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 60 * 1000,
      });

      res.cookie("userId", newUserId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken,
        },
        message: "Token refreshed successfully",
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
        return;
      }
      this.handleError(res, error, "Failed to refresh token");
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        await User.findOneAndUpdate(
          { refreshToken },
          { $unset: { refreshToken: 1 } }
        );
      }
      res.clearCookie("refreshToken");
      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to logout");
    }
  };

  private handleError(res: Response, error: any, message: string): void {
    console.error(`Error: ${message}`, error);
    res.status(500).json({
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
}
