import { UserController } from "@/controller/user";
import { requrieUser, verifyUser } from "../middleware/auth";
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
    this.router.get("/", (req, res) => {
      res.json({
        message: "API is running!",
        version: "1.0.0",
        endpoints: {
          auth: {
            "GET /api/user/product": "signup to get product from server",
            "GET /api/user/product/:id":
              "signup to get product  by id from server",
            "GET /api/user/categories": "signup to get categories from server",
            "GET /api/user/subcategories":
              "signup to get subcategories from server",
          },
        },
      });
    });
    this.router.use(requrieUser);
    this.router.get("/products", this.userController.getProducts);
    this.router.get("/product/:id", this.userController.getProductById);
    this.router.get("/categories", this.userController.getCategories);
    this.router.get("/subcategories", this.userController.getSubCategories);
    this.router.post("/wishlist", this.userController.addToWishlist);
    this.router.get("/wishlist", this.userController.getWishlist);
    this.router.delete(
      "/wishlist/:productId",

      this.userController.removeFromWishlist
    );
    this.router.delete("/wishlist", this.userController.clearWishlist);
  }

  public getRouter(): Router {
    return this.router;
  }
}
