import { AdminController } from "@/controller/admin";
import upload from "../utils/multer";
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";

export class AdminRoutes {
  private router: Router;
  private adminController: AdminController;

  constructor(adminController: AdminController) {
    this.router = Router();
    this.adminController = adminController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", (req, res) => {
      res.json({
        message: "Admin API is running!",
        version: "1.0.0",
        endpoints: {
          categories: {
            "POST /api/admin/categories": "Add a new category",
            "GET /api/admin/categories": "Get all categories",
          },
          subcategories: {
            "POST /api/admin/subcategories": "Add a new subcategory",
            "GET /api/admin/subcategories": "Get all subcategories",
          },
          products: {
            "POST /api/admin/products": "Add a new product",
            "GET /api/admin/products": "Get all products",
          },
        },
      });
    });

    this.router.use(requireAdmin);
    // Category routes
    this.router.post("/categories", this.adminController.addCategory);
    this.router.get("/categories", this.adminController.getCategories);

    // Subcategory routes
    this.router.post("/subcategories", this.adminController.addSubCategory);
    this.router.get("/subcategories", this.adminController.getSubCategories);

    // Product routes
    this.router.post(
      "/products",
      upload.array("images", 5),
      this.adminController.addProduct
    );
    this.router.put(
      "/product/:id",
      upload.array("images", 5),
      this.adminController.editProduct
    );
    this.router.get("/products", this.adminController.getProducts);
    this.router.get("/product/:id", this.adminController.getProductById);
  }

  public getRouter(): Router {
    return this.router;
  }
}
