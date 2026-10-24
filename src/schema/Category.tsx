import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    department: z.string().min(1, "Department selection is required"),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").optional(),
    department: z.string().optional(),
});
