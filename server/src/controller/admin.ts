import { Request, Response } from "express";
import Category, { ICategory } from "../models/category";
import SubCategory, { ISubCategory } from "../models/subCategory";
import Product, { IProduct } from "../models/product";
import { HttpCode } from "../utils/constants";

export class AdminController {
  public addCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Category name is required",
        });
        return;
      }
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        res.status(HttpCode.CONFLICT).json({
          success: false,
          message: "Category already exists",
        });
        return;
      }
      const newCategory = new Category({ name });
      await newCategory.save();
      res.status(HttpCode.CREATED).json({
        success: true,
        data: newCategory,
        message: "Category added successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to add category");
    }
  };

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

  // Subcategory methods
  public addSubCategory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { name, categoryId } = req.body;
      if (!name || !categoryId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Subcategory name and category ID are required",
        });
        return;
      }
      const category = await Category.findById(categoryId);
      if (!category) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Selected category does not exist",
        });
        return;
      }
      const existingSubCategory = await SubCategory.findOne({
        name,
        category: categoryId,
      });
      if (existingSubCategory) {
        res.status(HttpCode.CONFLICT).json({
          success: false,
          message: "Subcategory already exists under this category",
        });
        return;
      }
      const newSubCategory = new SubCategory({ name, category: categoryId });
      await newSubCategory.save();
      res.status(HttpCode.CREATED).json({
        success: true,
        data: newSubCategory,
        message: "Subcategory added successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to add subcategory");
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

  // Product methods
  public addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, variants, subcategory, description } = req.body;

      const images = req.files
        ? (req.files as Express.Multer.File[]).map((file) => file.filename)
        : [];

      if (!title || !variants || !subcategory || !description) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Title, variants, subcategory, and description are required",
        });
        return;
      }

      const parsedVariants = JSON.parse(variants);

      if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "At least one variant is required",
        });
        return;
      }

      for (const variant of parsedVariants) {
        if (!variant.ram || !variant.price || !variant.quantity) {
          res.status(HttpCode.BAD_REQUEST).json({
            success: false,
            message: "Each variant must have RAM, price, and quantity",
          });
          return;
        }
      }

      const subCategoryExists = await SubCategory.findById(subcategory);
      if (!subCategoryExists) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Selected subcategory does not exist",
        });
        return;
      }

      const newProduct = new Product({
        title,
        variants: parsedVariants,
        subcategory,
        description,
        images,
      });

      await newProduct.save();

      res.status(HttpCode.CREATED).json({
        success: true,
        data: newProduct,
        message: "Product added successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to add product");
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

  public editProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, variants, subcategory, description } = req.body;

      const images = req.files
        ? (req.files as Express.Multer.File[]).map((file) => file.filename)
        : [];

      if (!id || !title || !variants || !subcategory || !description) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message:
            "Product ID, title, variants, subcategory, and description are required",
        });
        return;
      }

      const product = await Product.findById(id);
      if (!product) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      const parsedVariants = JSON.parse(variants);

      if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "At least one variant is required",
        });
        return;
      }

      for (const variant of parsedVariants) {
        if (!variant.ram || !variant.price || !variant.quantity) {
          res.status(HttpCode.BAD_REQUEST).json({
            success: false,
            message: "Each variant must have RAM, price, and quantity",
          });
          return;
        }
      }

      const subCategoryExists = await SubCategory.findById(subcategory);
      if (!subCategoryExists) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Selected subcategory does not exist",
        });
        return;
      }

      product.title = title;
      product.variants = parsedVariants;
      product.subcategory = subcategory;
      product.description = description;

      if (images.length > 0) {
        product.images = images;
      }

      await product.save();

      res.status(HttpCode.OK).json({
        success: true,
        data: product,
        message: "Product updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update product");
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
