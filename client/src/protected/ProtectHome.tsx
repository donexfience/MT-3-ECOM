import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import AdminDashboard from "../pages/home/admin/AdminHome";
import UserDashboard from "../pages/home/user/UserHome";

export const ProtectedHome = () => {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  if (user.role === "admin") {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
};
