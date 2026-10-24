import { z } from "zod";

export const createProductSchema = z.object({
    title: z.string().min(2, "Product title must be at least 2 characters"),
    brand: z.string().min(1, "Brand is required"),
    department: z.string().min(1, "Department is required"),
    category: z.string().min(1, "Category is required"),
    features: z.string().min(1, "At least one feature is required"),
    tags: z.string().min(1, "At least one tag is required"),
});

export const updateProductSchema = z.object({
    title: z.string().min(2, "Product title must be at least 2 characters").optional(),
    brand: z.string().min(1, "Brand is required").optional(),
    department: z.string().optional(),
    category: z.string().optional(),
    features: z.union([z.string(), z.array(z.string())]).optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
});
