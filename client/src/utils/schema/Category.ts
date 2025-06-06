import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Category name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .refine(
      (val) => val.trim().length > 0,
      "Category name cannot be empty or just spaces"
    ),
});
