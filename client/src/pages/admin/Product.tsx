import React, { useState, useEffect } from "react";
import { Modal } from "../../components/Modal";
import { AddProductForm } from "../../components/product/AddProduct";
import { AddCategoryForm } from "../../components/category/AddCategory";
import { AddSubcategoryForm } from "../../components/SubCategory/AddSubCategory";
import {
  getCategories,
  getSubCategories,
  getProducts,
} from "../../services/admin";
import { Heart, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductSkeleton } from "@/components/skeleton/ProductSkeleton";
import { useNavigate } from "react-router-dom";

interface ProductProps {
  searchTerm: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category: Category;
}

interface Product {
  _id: string;
  title: string;
  price: string;
  images: string[];
  rating?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  subcategory?: {
    _id: string;
    name: string;
    category: string;
  };
  variants?: any[];
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    itemsPerPage: number;
    nextPage: number | null;
    prevPage: number | null;
    totalItems: number;
    totalPages: number;
  };
  message: string;
}

const Product: React.FC<ProductProps> = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getCategories();
        console.log(data, "categoryyyyyyyyyyyyyues");
        setCategories(data);
        const subs = await getSubCategories();
        console.log(subs.data, "sub cccccccateogory");
        setSubcategories(subs.data);
      } catch (err) {
        console.error("Error fetching categories/subcategories:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = (await getProducts({
          page,
          limit,
          search: searchTerm,
          subcategory: selectedSubcategory || "",
        })) as ProductsResponse;

        console.log(response, "products");

        if (response.success && response.data) {
          setProducts(response.data);
          setTotalProducts(response.pagination.totalItems);
          setTotalPages(response.pagination.totalPages);
        } else {
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(0);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, selectedSubcategory, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedSubcategory]);

  const openModal = (modal: string) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) newSet.delete(categoryId);
      else newSet.add(categoryId);
      return newSet;
    });
  };

  const renderStars = (rating?: number) => {
    const ratingValue = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xs ${
          i < ratingValue ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (page <= 4) {
        items.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        items.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        items.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return items;
  };

  const getDisplayRange = () => {
    const start = Math.min((page - 1) * limit + 1, totalProducts);
    const end = Math.min(page * limit, totalProducts);
    return { start, end };
  };

  const { start, end } = getDisplayRange();

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-gray-600 text-sm">Home</span>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-900 text-sm font-medium">Products</span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => openModal("category")}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Add Category
            </button>
            <button
              onClick={() => openModal("subcategory")}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Add Subcategory
            </button>
            <button
              onClick={() => openModal("product")}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-64 bg-white rounded-xl border border-gray-200 p-4 shadow-sm h-fit">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">
              Categories
            </h3>

            <div className="space-y-1">
              <div
                className={`cursor-pointer py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedSubcategory === null
                    ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedSubcategory(null)}
              >
                All Categories
              </div>

              {categories.map((category) => (
                <div key={category._id} className="space-y-1">
                  <div
                    className="flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <span className="text-gray-700 text-sm font-medium">
                      {category.name}
                    </span>
                    {expandedCategories.has(category._id) ? (
                      <ChevronDown size={14} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={14} className="text-gray-400" />
                    )}
                  </div>

                  {expandedCategories.has(category._id) && (
                    <div className="ml-4 space-y-1">
                      {subcategories
                        .filter((sub) => sub.category._id === category._id)
                        .map((sub) => (
                          <label
                            key={sub._id}
                            className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200"
                          >
                            <input
                              type="radio"
                              name="subcategory"
                              checked={selectedSubcategory === sub._id}
                              onChange={() => setSelectedSubcategory(sub._id)}
                              className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 focus:ring-2 mr-3"
                            />
                            <span className="text-gray-600 text-sm">
                              {sub.name}
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(limit)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedSubcategory
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Get started by adding your first product."}
                </p>
                <button
                  onClick={() => openModal("product")}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Add First Product
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/home/admin/product/${product._id}`)}
                      className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300 group relative transform hover:-translate-y-1"
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
                          src={`http://localhost:3000/uploads/${
                            product.images?.[0] || "placeholder.png"
                          }`}
                          alt={product.title}
                          className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/150x150?text=No+Image";
                          }}
                        />
                      </div>

                      <h3 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2 leading-tight">
                        {product.title}
                      </h3>
                      <p className="text-sm font-bold text-gray-900 mb-2">
                        ₹{product.price}
                      </p>

                      <div className="flex items-center mb-1">
                        {renderStars(product.rating)}
                        {product.rating && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.rating})
                          </span>
                        )}
                      </div>

                      {product.subcategory && (
                        <p className="text-xs text-gray-500 truncate">
                          {product.subcategory.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      {totalProducts > 0 && (
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">
                            Showing {start} - {end} of {totalProducts}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Show</span>
                        <select
                          value={limit}
                          onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                          }}
                          className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        >
                          <option value={10}>10 rows</option>
                          <option value={20}>20 rows</option>
                          <option value={50}>50 rows</option>
                          <option value={100}>100 rows</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {start} - {end} of {totalProducts} products
                      </div>

                      <Pagination>
                        <PaginationContent>
                          {page > 1 && (
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage(page - 1);
                                }}
                                className="h-9 px-3"
                              />
                            </PaginationItem>
                          )}

                          {generatePaginationItems().map((item, index) => (
                            <PaginationItem key={index}>
                              {item === "..." ? (
                                <PaginationEllipsis className="h-9 w-9" />
                              ) : (
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPage(Number(item));
                                  }}
                                  isActive={page === item}
                                  className="h-9 w-9 text-sm"
                                >
                                  {item}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}

                          {page < totalPages && (
                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage(page + 1);
                                }}
                                className="h-9 px-3"
                              />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={activeModal === "product"} onClose={closeModal}>
        <AddProductForm onClose={closeModal} />
      </Modal>
      <Modal isOpen={activeModal === "category"} onClose={closeModal}>
        <AddCategoryForm onClose={closeModal} />
      </Modal>
      <Modal isOpen={activeModal === "subcategory"} onClose={closeModal}>
        <AddSubcategoryForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Product;
