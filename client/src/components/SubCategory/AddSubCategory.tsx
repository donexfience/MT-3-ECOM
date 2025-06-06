import { useEffect, useState } from "react";
import { addSubcategory, getCategories } from "../../services/admin";
import { toast } from "react-fox-toast";

interface ICategory {
  _id: string;
  name: string;
}
interface ICategory {
  _id: string;
  name: string;
}

export const AddSubcategoryForm = ({ onClose }: { onClose: () => void }) => {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ categoryId?: string; name?: string }>(
    {}
  );

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: { categoryId?: string; name?: string } = {};

    if (!categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!name.trim()) {
      newErrors.name = "Subcategory name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Subcategory name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Subcategory name must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addSubcategory(categoryId, name.trim());
      toast.success(`Subcategory "${name}" added successfully!`);
      onClose();
    } catch (error) {
      toast.error("Failed to add subcategory");
      console.error("Failed to add subcategory", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    if (errors.categoryId) {
      setErrors({ ...errors, categoryId: undefined });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto transform animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Add Subcategory
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Create a new subcategory under existing category
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full p-2"
            disabled={isSubmitting}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Parent Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                disabled={isLoading || isSubmitting}
                className={`appearance-none w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 text-gray-700 font-medium bg-white ${
                  errors.categoryId
                    ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  isLoading || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <option value="">
                  {isLoading
                    ? "Loading categories..."
                    : "Choose a parent category"}
                </option>
                {categories.map((cat: ICategory) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-400 border-t-transparent"></div>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            </div>

            {errors.categoryId && (
              <div className="flex items-center space-x-2 text-red-600 animate-in slide-in-from-top-1 duration-200">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium">{errors.categoryId}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Subcategory Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                disabled={isSubmitting}
                placeholder="Enter subcategory name..."
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 text-gray-700 font-medium ${
                  errors.name
                    ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span
                  className={`text-xs font-medium ${
                    name.length > 45
                      ? "text-red-500"
                      : name.length > 35
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  {name.length}/50
                </span>
              </div>
            </div>

            {errors.name && (
              <div className="flex items-center space-x-2 text-red-600 animate-in slide-in-from-top-1 duration-200">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium">{errors.name}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-8 mt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || !categoryId || !name.trim()}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 border-2 border-transparent rounded-xl hover:from-orange-600 hover:to-pink-600 focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Subcategory
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
