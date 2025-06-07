import { useEffect, useState } from "react";
import { getWishlistUser, removeFromWishlistUser } from "@/services/user";
import { Heart, ShoppingBag, X, Star, Trash2 } from "lucide-react";
import { toast } from "react-fox-toast";

interface WishlistSidebarProps {
  onClose: () => void;
}

export const WishlistSidebar: React.FC<WishlistSidebarProps> = ({
  onClose,
}) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imageName: string) =>
    `${import.meta.env.VITE_BACKEND_URL_IMAGE}/${imageName}`;

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlistUser();
      console.log(data);
      setWishlist(data.items || []);
    } catch (error) {
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlistUser(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
      toast.success("Product removed from wishlist");
    } catch {
      toast.error("Failed to remove product");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed top-1 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading wishlist...
            </div>
          ) : wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding items you love to see them here!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in
                your wishlist
              </div>

              {wishlist.map((item, index) => (
                <div
                  key={item.product._id}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-pink-200"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "slideInRight 0.5s ease-out forwards",
                  }}
                >
                  <div className="flex space-x-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={getImageUrl(item.product.images[0])}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/fallback-image.jpg";
                        }}
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white fill-current" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-pink-600 transition-colors duration-200">
                        {item.product.title}
                      </h3>

                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-pink-600">
                          ${item.product.variants[0].price}
                        </span>
                        {item.product.variants[0].compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.product.variants[0].compareAtPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">(4.8)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <button className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors duration-200 flex items-center space-x-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group/btn"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default WishlistSidebar;
