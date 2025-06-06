import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { addCategory } from "../../services/admin";
import { categorySchema } from "../../utils/schema/Category";
import { toast } from "react-fox-toast";

interface IFormValues {
  name: string;
}

export const AddCategoryForm = ({ onClose }: { onClose: () => void }) => {
  const initialValues: IFormValues = { name: "" };

  const handleSubmit = async (
    values: IFormValues,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      categorySchema.parse(values);
      const { data } = await addCategory(values.name.trim());
      toast.success(`category ${data.name} added `);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setFieldError(err.path[0], err.message);
        });
      } else {
        toast.error("failed to add ");
        setFieldError("name", "Failed to add category. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-3">
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
              <h2 className="text-xl font-bold text-gray-900">Add Category</h2>
              <p className="text-sm text-gray-500 mt-1">
                Create a new category for your items
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
              categorySchema.parse(values);
              return {};
            } catch (error) {
              if (error instanceof z.ZodError) {
                const errors: any = {};
                error.errors.forEach((err) => {
                  errors[err.path[0]] = err.message;
                });
                return errors;
              }
              return {};
            }
          }}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter category name"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {values.name.length}/50 characters
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !values.name.trim()}
                  className={`px-8 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                    isSubmitting || !values.name.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ADDING...
                    </div>
                  ) : (
                    "ADD"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
