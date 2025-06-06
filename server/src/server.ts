import express, { Application } from "express";
import Database from "./config/database";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { AuthRoutes } from "./routes/auth";
import { AuthController } from "./controller/auth";
import { AdminController } from "./controller/admin";
import { AdminRoutes } from "./routes/admin";
dotenv.config();

class Server {
  private app: Application;
  private port: number;
  private authController: AuthController;
  private adminController: AdminController;
  private authRoutes: AuthRoutes;
  private adminRoutes: AdminRoutes;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.authController = new AuthController();
    this.adminController = new AdminController();
    this.authRoutes = new AuthRoutes(this.authController);
    this.adminRoutes = new AdminRoutes(this.adminController);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use(
      cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
      })
    );
    this.app.use(morgan("tiny"));
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "public/uploads"))
    );
  }

  private initializeRoutes(): void {
    this.app.use("/api/auth", this.authRoutes.getRouter());
    this.app.use("/api/admin", this.adminRoutes.getRouter());

    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📍 Health check: http://localhost:${this.port}/health`);
      console.log(`📍 API endpoints: http://localhost:${this.port}/api`);
    });
  }

  private async connectToDatabase(): Promise<void> {
    await Database.connect();
  }

  public getApp(): Application {
    return this.app;
  }
}

export default Server;
