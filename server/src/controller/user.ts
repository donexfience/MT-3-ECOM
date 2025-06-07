import { Request, Response } from "express";
import Category, { ICategory } from "../models/category";
import SubCategory, { ISubCategory } from "../models/subCategory";
import Product, { IProduct } from "../models/product";
import { HttpCode } from "../utils/constants";

export class UserController {
  public getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await Category.find();
      res.status(HttpCode.OK).json({
        success: true,
        data: categories,
        message: "Categories retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve categories");
    }
  };


  public getProductById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Product ID is required",
        });
        return;
      }

      const product = await Product.findById(id).populate({
        path: "subcategory",
        populate: { path: "category" },
      });

      if (!product) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      res.status(HttpCode.OK).json({
        success: true,
        data: product,
        message: "Product retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve product");
    }
  };

  public getSubCategories = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const subCategories = await SubCategory.find().populate("category");
      res.status(HttpCode.OK).json({
        success: true,
        data: subCategories,
        message: "Subcategories retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve subcategories");
    }
  };

  public getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const subcategory = (req.query.subcategory as string) || "";

      const skip = (page - 1) * limit;

      const query: any = {};

      if (search.trim()) {
        query.title = { $regex: `^${search}`, $options: "i" };
      }

      if (subcategory.trim()) {
        query.subcategory = subcategory;
      }

      const [products, totalCount] = await Promise.all([
        Product.find(query)
          .populate("subcategory")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Product.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.status(HttpCode.OK).json({
        success: true,
        data: products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null,
        },
        message: "Products retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve products");
    }
  };

  private handleError(res: Response, error: any, message: string): void {
    console.error(`Error: ${message}`, error);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
}
