import type React from "react";
import { useUserStore } from "../store/user";
import { Navigate } from "react-router-dom";

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((state) => state.user);
  return user ? <Navigate to="/home" replace /> : children;
};
