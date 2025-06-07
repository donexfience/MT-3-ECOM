import { Request, Response } from "express";
import Category, { ICategory } from "../models/category";
import SubCategory, { ISubCategory } from "../models/subCategory";
import Product, { IProduct } from "../models/product";
import Wishlist, { IWishlist } from "../models/wishlist";

import { HttpCode } from "../utils/constants";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

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

  public addToWishlist = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { productId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpCode.UNAUTHORIZED).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      if (!productId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Product ID is required",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid product ID format",
        });
        return;
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      let wishlist = await Wishlist.findOne({ user: userId });

      if (!wishlist) {
        wishlist = new Wishlist({
          user: userId,
          items: [{ product: productId }],
        });
      } else {
        const alreadyExists = wishlist.items.some(
          (item) => item.product.toString() === productId
        );

        if (alreadyExists) {
          res.status(HttpCode.CONFLICT).json({
            success: false,
            message: "Product already in wishlist",
          });
          return;
        }

        wishlist.items.push({ product: productId });
      }

      await wishlist.save();

      const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
        path: "items.product",
        populate: {
          path: "subcategory",
          populate: { path: "category" },
        },
      });

      res.status(HttpCode.OK).json({
        success: true,
        data: populatedWishlist,
        message: "Product added to wishlist successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to add product to wishlist");
    }
  };

  public getWishlist = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpCode.UNAUTHORIZED).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      const wishlist = await Wishlist.findOne({ user: userId }).populate({
        path: "items.product",
        populate: {
          path: "subcategory",
          populate: { path: "category" },
        },
      });

      if (!wishlist) {
        res.status(HttpCode.OK).json({
          success: true,
          data: { user: userId, items: [] },
          message: "Wishlist is empty",
        });
        return;
      }

      res.status(HttpCode.OK).json({
        success: true,
        data: wishlist,
        message: "Wishlist retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve wishlist");
    }
  };

  public removeFromWishlist = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { productId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpCode.UNAUTHORIZED).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      if (!productId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Product ID is required",
        });
        return;
      }

      const wishlist = await Wishlist.findOne({ user: userId });

      if (!wishlist) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Wishlist not found",
        });
        return;
      }

      const itemIndex = wishlist.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Product not found in wishlist",
        });
        return;
      }

      wishlist.items.splice(itemIndex, 1);
      await wishlist.save();

      const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
        path: "items.product",
        populate: {
          path: "subcategory",
          populate: { path: "category" },
        },
      });

      res.status(HttpCode.OK).json({
        success: true,
        data: populatedWishlist,
        message: "Product removed from wishlist successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to remove product from wishlist");
    }
  };

  public clearWishlist = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(HttpCode.UNAUTHORIZED).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      const wishlist = await Wishlist.findOne({ user: userId });

      if (!wishlist) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Wishlist not found",
        });
        return;
      }

      wishlist.items = [];
      await wishlist.save();

      res.status(HttpCode.OK).json({
        success: true,
        data: wishlist,
        message: "Wishlist cleared successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to clear wishlist");
    }
  };

  private handleError(res: Response, error: any, message: string): void {
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
