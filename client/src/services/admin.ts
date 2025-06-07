import type { AxiosError } from "axios";
import type { APIErrorResponse } from "./auth";
import axiosInstance from "../utils/api/axiosInstance";

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/admin/categories");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getSubCategories = async () => {
  try {
    const response = await axiosInstance.get("/admin/subcategories");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const addCategory = async (name: string) => {
  try {
    const response = await axiosInstance.post("/admin/categories", { name });
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const addSubcategory = async (categoryId: string, name: string) => {
  try {
    const response = await axiosInstance.post("/admin/subcategories", {
      categoryId,
      name,
    });
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const addProduct = async (formData: any) => {
  try {
    const response = await axiosInstance.post("/admin/products", formData);
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getProducts = async ({
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
    const response = await axiosInstance.get("/admin/products", {
      params: { page, limit, search, subcategory },
    });
    console.log(response, "get products");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getProductById = async (productId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/product/${productId}`);
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const editProduct = async (productId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/admin/product/${productId}`,
      formData
    );
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};
