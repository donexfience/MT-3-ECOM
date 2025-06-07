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
import { ChevronRight, Loader2, Filter, Menu } from "lucide-react";
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
import { CategoriesSidebar } from "@/components/category/CategorySideBar";
import { ProductCard } from "@/components/product/ProductCard";

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

interface PRODUCTSRESPONSE {
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
        const subs = await getSubCategories();
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
        })) as PRODUCTSRESPONSE;

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileFilters(false);
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <div className="flex items-center">
            <button
              className="text-gray-600 text-sm"
              onClick={() => navigate("/home")}
            >
              Home
            </button>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-900 text-sm font-medium">Products</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} className="text-gray-600" />
            </button>

            <div
              className={`${
                showMobileMenu ? "flex" : "hidden"
              } sm:flex flex-col sm:flex-row gap-2 sm:gap-3 absolute sm:relative top-12 sm:top-0 left-3 sm:left-0 right-3 sm:right-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none shadow-lg sm:shadow-none border sm:border-none z-50`}
            >
              <button
                onClick={() => {
                  openModal("category");
                  setShowMobileMenu(false);
                }}
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  openModal("subcategory");
                  setShowMobileMenu(false);
                }}
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Add Subcategory
              </button>
              <button
                onClick={() => {
                  openModal("product");
                  setShowMobileMenu(false);
                }}
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Filter size={16} />
            Filter Categories
          </button>
        </div>

        <div className="flex gap-4 lg:gap-6 relative">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CategoriesSidebar
              categories={categories}
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSelect={(id) => setSelectedSubcategory(id)}
              expandedCategories={expandedCategories}
              onToggleCategory={toggleCategory}
            />
          </div>

          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto">
                <CategoriesSidebar
                  categories={categories}
                  subcategories={subcategories}
                  selectedSubcategory={selectedSubcategory}
                  onSelect={(id) => {
                    setSelectedSubcategory(id);
                    setShowMobileFilters(false);
                  }}
                  expandedCategories={expandedCategories}
                  onToggleCategory={toggleCategory}
                  showCloseButton={true}
                  onClose={() => setShowMobileFilters(false)}
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {[...Array(limit)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-12 text-center shadow-sm">
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
                <p className="text-gray-500 mb-6 text-sm sm:text-base">
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
                <div className="grid grid-cols chimp-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onClick={() =>
                        navigate(`/home/product/${product._id}`)
                      }
                    />
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                        <span className="text-sm text-gray-600 hidden sm:inline">
                          Show
                        </span>
                        <select
                          value={limit}
                          onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                          }}
                          className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-600">rows</span>
                      </div>
                    </div>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600 order-2 sm:order-1">
                        <span className="hidden sm:inline">
                          Showing {start} - {end} of {totalProducts} products
                        </span>
                        <span className="sm:hidden">
                          Page {page} of {totalPages}
                        </span>
                      </div>

                      <div className="order-1 sm:order-2">
                        <Pagination>
                          <PaginationContent className="flex-wrap justify-center">
                            {page > 1 && (
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page - 1);
                                  }}
                                  className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                                />
                              </PaginationItem>
                            )}

                            {generatePaginationItems()
                              .slice(0, window.innerWidth < 640 ? 5 : undefined)
                              .map((item, index) => (
                                <PaginationItem key={index}>
                                  {item === "..." ? (
                                    <PaginationEllipsis className="h-8 w-8 sm:h-9 sm:w-9" />
                                  ) : (
                                    <PaginationLink
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPage(Number(item));
                                      }}
                                      isActive={page === item}
                                      className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm"
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
                                  className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                                />
                              </PaginationItem>
                            )}
                          </PaginationContent>
                        </Pagination>
                      </div>
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
