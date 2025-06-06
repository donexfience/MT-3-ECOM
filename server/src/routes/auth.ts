import { AuthController } from "@/controller/auth";
import { Router } from "express";

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;

  constructor(authController: AuthController) {
    this.router = Router();
    this.authController = authController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/signup", this.authController.signup);
    this.router.post("/signin", this.authController.login);
    this.router.post("/logout", this.authController.logout);
    this.router.get("/", (req, res) => {
      res.json({
        message: "API is running!",
        version: "1.0.0",
        endpoints: {
          auth: {
            "POST /api/auth/signin": "login to server",
            "POST /api/auth/signup": "signup to server",
            "LOGOUT /api/auth/logout":"logout from server",
          },
        },
      });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
