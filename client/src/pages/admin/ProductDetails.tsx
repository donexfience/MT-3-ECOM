import { EditProductForm } from "@/components/product/EditProduct";
import { getProductById } from "@/services/admin";
import { useUserStore } from "@/store/user";
import {
  AlertCircle,
  ArrowLeft,
  Heart,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-fox-toast";
import { useNavigate, useParams } from "react-router-dom";

interface Subcategory {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Variant {
  _id?: string;
  price: number;
  quantity: number;
  ram?: number;
  storage?: number;
  color?: string;
  size?: string;
  [key: string]: any;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  subcategory: Subcategory;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!productId) {
          throw new Error("Product ID is missing");
        }
        const { data } = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  const handleQuantityChange = (increment: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + increment;
      const maxQuantity = product?.variants?.[selectedVariant]?.quantity || 1;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  };

  const handleVariantChange = (variantIndex: number) => {
    setSelectedVariant(variantIndex);
    setQuantity(1);
  };

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    console.log("Product updated successfully");
    toast.success("product edited successfully");
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedProductId("");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Error Loading Product
          </h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const currentVariant =
    product.variants?.[selectedVariant] || product.variants?.[0] || {};
  const images = product.images || [];
  const isInStock = currentVariant.quantity > 0;

  const getImageUrl = (imageName: string) =>
    `http://localhost:3000/uploads/${imageName}`;

  const getVariantDisplayText = (variant: Variant, index: number) => {
    if (variant.ram) {
      return `${variant.ram} GB RAM`;
    }
    if (variant.storage) {
      return `${variant.storage} GB`;
    }
    if (variant.color) {
      return variant.color;
    }
    if (variant.size) {
      return variant.size;
    }
    return `Variant ${index + 1}`;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {showEditModal && (
        <EditProductForm
          productId={selectedProductId}
          onClose={handleCloseModal}
          onSuccess={handleEditSuccess}
        />
      )}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <button onClick={() => navigate("/home")}>Home</button>
                <span>/</span>
                <span>{product.subcategory?.name}</span>
                <span>/</span>
                <span>Product details</span>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-sm overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={getImageUrl(images[selectedImage])}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/fallback-image.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${currentVariant.price || 0}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(4.5)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Availability:
              </span>
              <span
                className={`text-sm font-medium ${
                  isInStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {isInStock ? "In stock" : "Out of stock"}
              </span>
            </div>
            {isInStock && (
              <div className="text-sm text-gray-500">
                Hurry up! {currentVariant.quantity} left in stock!
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {product.variants.some((v) => v.ram)
                    ? "RAM:"
                    : product.variants.some((v) => v.storage)
                    ? "Storage:"
                    : product.variants.some((v) => v.color)
                    ? "Color:"
                    : product.variants.some((v) => v.size)
                    ? "Size:"
                    : "Options:"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantChange(index)}
                      className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                        selectedVariant === index
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {getVariantDisplayText(variant, index)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Quantity:
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (currentVariant.quantity || 1)}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                disabled={!isInStock}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Buy it now</span>
              </button>
              {user?.role === "admin" && (
                <button
                  disabled={!isInStock}
                  className="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => handleEditProduct(product._id)}
                >
                  Edit product
                </button>
              )}

              {user?.role === "user" && (
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              )}
            </div>

            {product.description && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">
                    {product.subcategory?.category?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subcategory:</span>
                  <span className="text-gray-900">
                    {product.subcategory?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
