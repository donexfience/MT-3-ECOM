import { useEffect, useState } from "react";
import { addProduct, getSubCategories } from "../../services/admin";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { productSchema } from "../../utils/schema/product";
import { z } from "zod";
import { toast } from "react-fox-toast";

interface ISubcategory {
  _id: string;
  name: string;
}

interface IVariant {
  ram: string;
  price: string;
  quantity: number;
}

interface IFormValues {
  title: string;
  description: string;
  subcategory: string;
  variants: IVariant[];
  images: File[];
}

export const AddProductForm = ({ onClose }: { onClose: () => void }) => {
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data } = await getSubCategories();
        setSubcategories(data || []);
      } catch (error) {
        toast.error("failed to fetch sub categories");
      }
    };
    fetchSubcategories();
  }, []);

  const initialValues: IFormValues = {
    title: "",
    description: "",
    subcategory: "",
    variants: [{ ram: "", price: "", quantity: 1 }],
    images: [],
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...imageFiles, ...newFiles];
      setImageFiles(updatedFiles);
      setFieldValue("images", updatedFiles);
    }
  };

  const removeImage = (index: number, setFieldValue: any) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setFieldValue("images", updatedFiles);
  };

  const handleSubmit = async (values: IFormValues) => {
    try {
      productSchema.parse(values);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("subcategory", values.subcategory);
      formData.append("variants", JSON.stringify(values.variants));
      values.images.forEach((img) => formData.append("images", img));
      await addProduct(formData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // console.error("Validation errors:", error.errors);
      } else {
        // console.error("Failed to add product", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl px-8 py-6">
        <div className="flex items-center justify-between mb-6">
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
              <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>
              <p className="text-sm text-gray-500 mt-1">
                Create a new product under existing subcategory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full p-2"
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

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={(values) => {
            try {
              productSchema.parse(values);
              return {};
            } catch (error) {
              if (error instanceof z.ZodError) {
                const errors: any = {};
                error.errors.forEach((err) => {
                  const path = err.path.join(".");
                  errors[path] = err.message;
                });
                return errors;
              }
              return {};
            }
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title :
                </label>
                <Field
                  type="text"
                  name="title"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                    errors.title && touched.title
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="Enter product title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Variants :
                </label>
                <FieldArray name="variants">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.variants.map((variant, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Ram:
                            </label>
                            <Field
                              type="text"
                              name={`variants.${index}.ram`}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              placeholder="e.g. 8 GB"
                            />
                            <ErrorMessage
                              name={`variants.${index}.ram`}
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Price:
                            </label>
                            <Field
                              type="text"
                              name={`variants.${index}.price`}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              placeholder="$ 0.00"
                            />
                            <ErrorMessage
                              name={`variants.${index}.price`}
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          <div className="flex-shrink-0">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              QTY:
                            </label>
                            <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                              <button
                                type="button"
                                onClick={() => {
                                  const newQty = Math.max(
                                    0,
                                    variant.quantity - 1
                                  );
                                  setFieldValue(
                                    `variants.${index}.quantity`,
                                    newQty
                                  );
                                }}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                              >
                                −
                              </button>
                              <Field
                                type="number"
                                name={`variants.${index}.quantity`}
                                className="w-12 text-center border-none focus:outline-none"
                                min="0"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue(
                                    `variants.${index}.quantity`,
                                    variant.quantity + 1
                                  );
                                }}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                              >
                                +
                              </button>
                            </div>
                            <ErrorMessage
                              name={`variants.${index}.quantity`}
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {values.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="mt-6 text-red-500 hover:text-red-700 font-bold text-lg focus:outline-none"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          push({ ram: "", price: "", quantity: 1 })
                        }
                        className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors font-medium"
                      >
                        Add variants
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub category :
                </label>
                <Field
                  as="select"
                  name="subcategory"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                    errors.subcategory && touched.subcategory
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="subcategory"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description :
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all ${
                    errors.description && touched.description
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="Enter product description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Upload image:
                </label>
                <div className="flex gap-4 flex-wrap">
                  {imageFiles.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-24 h-20 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i, setFieldValue)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <label className="w-24 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-2xl text-gray-400 group-hover:text-orange-400 mb-1">
                        📷
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-orange-600">
                        Add
                      </div>
                    </div>
                  </label>
                </div>
                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-12 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  ADD
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
