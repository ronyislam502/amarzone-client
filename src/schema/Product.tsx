import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  brand: z.string().min(1, "Brand name is required"),
  department: z.string().min(1, "Department is required"),
  category: z.string().min(1, "Category is required"),
});
