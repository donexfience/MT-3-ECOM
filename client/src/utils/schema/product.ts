import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  subcategory: z.string().min(1, "Subcategory is required"),
  variants: z
    .array(
      z.object({
        ram: z.string().min(1, "RAM is required"),
        price: z
          .string()
          .min(1, "Price is required")
          .refine((val) => {
            const num = parseFloat(val.replace(/[$,]/g, ""));
            return !isNaN(num) && num > 0;
          }, "Price must be a valid positive number"),
        quantity: z.number().min(0, "Quantity must be at least 0"),
      })
    )
    .min(1, "At least one variant is required"),
  images: z.array(z.any()).min(1, "At least one image is required"),
});
