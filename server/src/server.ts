import express, { Application } from "express";
import { UserController } from "./controller/user";
import { UserRoutes } from "./routes/user";

class Server {
  private app: Application;
  private port: number;
  private userController: UserController;
  private userRoutes: UserRoutes;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.userController = new UserController();
    this.userRoutes = new UserRoutes(this.userController);

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.use("/api/user", this.userRoutes.getRouter());

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

  public getApp(): Application {
    return this.app;
  }
}

export default Server;
