import React from "react";
import { Heart } from "lucide-react";
import { StarRating } from "./StarRating";

interface Product {
  _id: string;
  title: string;
  price: string;
  images: string[];
  rating?: number;
  subcategory?: {
    _id: string;
    name: string;
    category: string;
  };
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300 group relative transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute top-3 right-3 z-10">
        <button className="w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <Heart
            size={12}
            className="text-gray-400 group-hover:text-red-400 transition-colors"
          />
        </button>
      </div>

      <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL_IMAGE}/${
            product.images?.[0] || "placeholder.png"
          }`}
          alt={product.title}
          className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/150x150?text=No+Image";
          }}
        />
      </div>

      <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 leading-tight">
        {product.title}
      </h3>
      <p className="text-sm sm:text-base font-bold text-gray-900 mb-2">
        ₹{product.price}
      </p>

      <div className="flex items-center mb-1">
        <StarRating rating={product.rating || 0} />
        {product.rating && (
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        )}
      </div>

      {product.subcategory && (
        <p className="text-xs text-gray-500 truncate">
          {product.subcategory.name}
        </p>
      )}
    </div>
  );
};
