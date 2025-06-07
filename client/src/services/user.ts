import type { AxiosError } from "axios";
import type { APIErrorResponse } from "./auth";
import axiosInstance from "../utils/api/axiosInstance";

export const getCategoriesUser = async () => {
  try {
    const response = await axiosInstance.get("/user/categories");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getSubCategoriesUser = async () => {
  try {
    const response = await axiosInstance.get("/user/subcategories");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getProductsUser = async ({
  page,
  limit,
  search,
  subcategory,
}: {
  page: number;
  limit: number;
  search: string;
  subcategory: string;
}) => {
  try {
    const response = await axiosInstance.get("/user/products", {
      params: { page, limit, search, subcategory },
    });
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getProductByIdUser = async (productId: string) => {
  try {
    const response = await axiosInstance.get(`/user/product/${productId}`);
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const addToWishlistUser = async (productId: string) => {
  try {
    const response = await axiosInstance.post("/user/wishlist", { productId });
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getWishlistUser = async () => {
  try {
    const response = await axiosInstance.get("/user/wishlist");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const removeFromWishlistUser = async (productId: string) => {
  try {
    const response = await axiosInstance.delete(`/user/wishlist/${productId}`);
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const clearWishlistUser = async () => {
  try {
    const response = await axiosInstance.delete("/user/wishlist");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};
