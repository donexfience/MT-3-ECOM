import { clearUserFn, useUserStore } from "@/store/user";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshInstance = axios.create({
          baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
          withCredentials: true,
        });
        await refreshInstance.post("/auth/refresh");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearUserFn();
        if (typeof window !== "undefined") {
          window.location.href = "/home";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
