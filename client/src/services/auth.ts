import axiosInstance from "../utils/api/axiosInstance";
import type { AxiosError } from "axios";
export type APIErrorResponse = {
  message: string;
};

export const signup = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/signup", formData);
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const signin = async (formData: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/auth/signin", formData);
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};
