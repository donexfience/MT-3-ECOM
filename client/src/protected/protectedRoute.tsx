import type React from "react";
import { useUserStore } from "../store/user";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: string;
}) => {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }
  return children;
};



