import { useEffect, useState } from "react";
import {
  editProduct,
  getSubCategories,
  getProductById,
} from "../../services/admin";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { z } from "zod";
import Loading from "../Loading/Loading";

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

interface IExistingProduct {
  _id: string;
  title: string;
  description: string;
  subCategory: ISubcategory;
  variants: IVariant[];
  images: string[];
}

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  variants: z.array(
    z.object({
      ram: z.string().min(1, "RAM is required"),
      price: z.string().min(1, "Price is required"),
      quantity: z.number().min(0, "Quantity cannot be negative"),
    })
  ),
  images: z.array(z.instanceof(File)).optional(),
});

export const EditProductForm = ({
  productId,
  onClose,
  onSuccess,
}: {
  productId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialFormValues, setInitialFormValues] = useState<IFormValues>({
    title: "",
    description: "",
    subcategory: "",
    variants: [{ ram: "", price: "", quantity: 1 }],
    images: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: subcategoriesData } = await getSubCategories();
        const productResponse = await getProductById(productId);
        const subcats = subcategoriesData || [];
        setSubcategories(subcats);
        const product: IExistingProduct = productResponse.data;
        setExistingImages(product.images || []);
        setInitialFormValues({
          title: product.title || "",
          description: product.description || "",
          subcategory: product.subCategory?._id || subcats[0]?._id || "",
          variants:
            product.variants?.length > 0
              ? product.variants.map((variant) => ({
                  ram: String(variant.ram) || "",
                  price: String(variant.price) || "",
                  quantity: Number(variant.quantity) || 1,
                }))
              : [{ ram: "", price: "", quantity: 1 }],
          images: [],
        });
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

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

  const removeNewImage = (index: number, setFieldValue: any) => {
    const updatedFiles = imageFiles.filter((v, i) => i !== index);
    setImageFiles(updatedFiles);
    setFieldValue("images", updatedFiles);
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (values: IFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("subcategory", values.subcategory);
      formData.append("variants", JSON.stringify(values.variants));
      formData.append("existingImages", JSON.stringify(existingImages));
      if (values.images && values.images.length > 0) {
        values.images.forEach((img) => formData.append("images", img));
      }
      await editProduct(productId, formData);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <p className="text-sm text-gray-500 mt-1">
                Update product information and details
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
          initialValues={initialFormValues}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validate={(values) => {
            try {
              productSchema.parse(values);
              if (existingImages.length === 0 && values.images.length === 0) {
                return { images: "At least one image is required" };
              }
              return {};
            } catch (error) {
              if (error instanceof z.ZodError) {
                console.log("Validation errors:", error.errors);
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title :
                </label>
                <Field
                  type="text"
                  name="title"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
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
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
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
                {subcategories.length === 0 && (
                  <div className="text-yellow-500 text-sm mt-1">
                    Warning: No subcategories available. Please check the API.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description :
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all ${
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
                  Product Images:
                </label>

                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Current Images:
                    </h4>
                    <div className="flex gap-4 flex-wrap">
                      {existingImages.map((imgUrl, i) => (
                        <div key={`existing-${i}`} className="relative group">
                          <img
                            src={`${
                              import.meta.env.VITE_API_URL
                            }/uploads/${imgUrl}`}
                            alt="existing product"
                            className="w-24 h-20 object-cover rounded-xl border-2 border-gray-200"
                          />

                          <button
                            type="button"
                            onClick={() => removeExistingImage(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 flex-wrap">
                  {imageFiles.map((img, i) => (
                    <div key={`new-${i}`} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="new preview"
                        className="w-24 h-20 object-cover rounded-xl border-2 border-green-200"
                      />
                      <div className="absolute -top-1 -left-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        N
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(i, setFieldValue)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <label className="w-24 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-2xl text-gray-400 group-hover:text-blue-400 mb-1">
                        📷
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-blue-600">
                        Add
                      </div>
                    </div>
                  </label>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Green border = New images | Gray border = Existing images
                </p>

                {existingImages.length === 0 && imageFiles.length === 0 && (
                  <div className="text-red-500 text-sm mt-2">
                    At least one image is required
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-12 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  UPDATE
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
