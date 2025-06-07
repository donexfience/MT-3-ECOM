import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import SignIn from "./pages/auth/SignIn";
import { ToastContainer } from "react-fox-toast";
import { ProtectedHome } from "./protected/ProtectHome";
import { GuestRoute } from "./protected/GuestRoute";
import { ProtectedRoute } from "./protected/protectedRoute";
import AdminLayout from "./layouts/AdminLayout";
// import AdminDashboard from "./pages/home/admin/AdminHome";
// import UserDashboard from "./pages/home/user/UserHome";
import UserProfile from "./pages/profile/UserProfile";
import UserLayout from "./layouts/UserLayout";
import Product from "./pages/admin/Product";
import { useState } from "react";
import ProductDetailsPage from "./pages/admin/ProductDetails";
import NotFoundPage from "./pages/404/NotFound";
import UserProduct from "./pages/user/Product";
import UserProductDetailsPage from "./pages/user/ProductDetails";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Home route */}
          <Route path="/home" element={<ProtectedHome />} />

          {/* Public routes */}
          <Route
            path="/sign-up"
            element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <GuestRoute>
                <SignIn />
              </GuestRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout onSearch={setSearchQuery} />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<AdminDashboard />} /> */}
            <Route
              path="admin/product"
              element={<Product searchTerm={searchQuery} />}
            />
            <Route
              path="admin/product/:productId"
              element={<ProductDetailsPage />}
            />
          </Route>

          {/* User routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout onSearch={setSearchQuery} />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<UserDashboard />} /> */}
            <Route
              path="user/product"
              element={<UserProduct searchTerm={searchQuery} />}
            />
            <Route
              path="user/product/:productId"
              element={<UserProductDetailsPage />}
            />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
