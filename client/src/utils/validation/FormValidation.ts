interface IFormValues {
  title: string;
  description: string;
  subcategory: string;
  variants: IVariant[];
  images: File[];
}

interface IVariant {
  ram: string;
  price: string;
  quantity: number;
}

export const validateForm = (values: IFormValues) => {
  const errors: any = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  }

  if (!values.subcategory) {
    errors.subcategory = "Subcategory is required";
  }

  if (!values.variants || values.variants.length === 0) {
    errors.variants = "At least one variant is required";
  } else {
    const variantErrors: any[] = [];
    values.variants.forEach((variant, index) => {
      const variantError: any = {};
      if (!variant.ram.trim()) {
        variantError.ram = "RAM is required";
      }
      if (!variant.price.trim()) {
        variantError.price = "Price is required";
      }
      if (variant.quantity < 0) {
        variantError.quantity = "Quantity cannot be negative";
      }
      if (Object.keys(variantError).length > 0) {
        variantErrors[index] = variantError;
      }
    });
    if (variantErrors.length > 0) {
      errors.variants = variantErrors;
    }
  }

  return errors;
};
