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
            path="/home/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout onSearch={setSearchQuery} />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<AdminDashboard />} /> */}
            <Route
              path="product"
              element={<Product searchTerm={searchQuery} />}
            />
            <Route
              path="product/:productId"
              element={<ProductDetailsPage/>}
            />
          </Route>

          {/* User routes */}
          <Route
            path="/home/user"
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<UserDashboard />} /> */}
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<>Not found</>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
