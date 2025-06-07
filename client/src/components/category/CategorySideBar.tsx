import React from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category: Category;
}

interface CategoriesSidebarProps {
  categories: Category[];
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSelect: (subcategoryId: string | null) => void;
  expandedCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  categories,
  subcategories,
  selectedSubcategory,
  onSelect,
  expandedCategories,
  onToggleCategory,
  showCloseButton = false,
  onClose,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">Categories</h3>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <div
          className={`cursor-pointer py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${
            selectedSubcategory === null
              ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium border border-orange-200"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => onSelect(null)}
        >
          All Categories
        </div>

        {categories.map((category) => (
          <div key={category._id} className="space-y-1">
            <div
              className="flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
              onClick={() => onToggleCategory(category._id)}
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
                        onChange={() => onSelect(sub._id)}
                        className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 focus:ring-2 mr-3"
                      />
                      <span className="text-gray-600 text-sm">{sub.name}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
