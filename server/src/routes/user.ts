import { UserController } from "@/controller/user";
import { Router } from "express";

export class UserRoutes {
  private router: Router;
  private userController: UserController;

  constructor(userController: UserController) {
    this.router = Router();
    this.userController = userController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/products", this.userController.getProducts);
    this.router.get("/product/:id", this.userController.getProductById);
    this.router.get("/categories", this.userController.getCategories);
    this.router.get("/subcategories", this.userController.getSubCategories);
    this.router.get("/", (req, res) => {
      res.json({
        message: "API is running!",
        version: "1.0.0",
        endpoints: {
          auth: {
            "POST /api/auth/signin": "login to server",
            "POST /api/auth/signup": "signup to server",
            "LOGOUT /api/auth/logout": "logout from server",
          },
        },
      });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
