import { useEffect, useState } from "react";
import { Heart, LogOut, UserCircle, Crown } from "lucide-react";
import { useUserStore } from "@/store/user";
import { logout } from "@/services/auth";
import { toast } from "react-fox-toast";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import WishlistSidebar from "../wishlist/Wishlist";

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue && onSearch) onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      toast.success("Logged out successfully");
      navigate("/sign-in");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  return (
    <header className="bg-[#003f5c] text-white px-4 py-3">
      <div className="max-w-full mx-auto flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="flex items-center ml-56 bg-white rounded-lg overflow-hidden shadow-md w-full">
            <input
              type="text"
              placeholder="Search anything"
              className="flex-1 px-4 py-3 text-gray-800 text-sm focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm ml-8">
          {!user ? (
            <>
              <div
                className="flex items-center space-x-1 cursor-pointer hover:text-gray-300"
                onClick={() => navigate("/sign-in")}
              >
                <UserCircle size={18} />
                <span>Login</span>
              </div>
              <div
                className="flex items-center space-x-1 cursor-pointer hover:text-gray-300"
                onClick={() => navigate("/sign-up")}
              >
                <UserCircle size={18} />
                <span>Sign Up</span>
              </div>
            </>
          ) : (
            <>
              {user.role !== "admin" && (
                <div
                  onClick={() => setIsWishlistOpen(true)}
                  className="flex items-center space-x-1 cursor-pointer hover:text-gray-300"
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
                </div>
              )}
              <div
                className="flex items-center space-x-1 cursor-pointer hover:text-gray-300"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#022c43] px-3 py-2 rounded-lg shadow-md">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left text-xs leading-tight">
                  <div className="flex items-center gap-1 font-semibold">
                    {user.role === "admin" ? (
                      <>
                        <Crown size={12} className="text-yellow-400" />
                        Hello Admin
                      </>
                    ) : (
                      "Hello User"
                    )}
                  </div>
                  <div className="text-white/80">{user.name}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isWishlistOpen && (
        <WishlistSidebar onClose={() => setIsWishlistOpen(false)} />
      )}
    </header>
  );
};

export default Header;
