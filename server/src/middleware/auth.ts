import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Access token required",
        code: "NO_TOKEN",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    res.status(401).json({
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
};

export const verifyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
        code: "NO_USER",
      });
      return;
    }

    if (req.user.role !== "admin") {
      res.status(403).json({
        message: "Admin access required",
        code: "INSUFFICIENT_PERMISSIONS",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Authorization error",
      code: "AUTH_ERROR",
    });
  }
};

export const requireAdmin = [verifyToken, verifyAdmin];

export const verifyUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
        code: "NO_USER",
      });
      return;
    }

    if (req.user.role !== "user" && req.user.role !== "admin") {
      res.status(403).json({
        message: "User access required",
        code: "INSUFFICIENT_PERMISSIONS",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Authorization error",
      code: "AUTH_ERROR",
    });
  }
};

export const requrieUser = [verifyToken, verifyUser];
