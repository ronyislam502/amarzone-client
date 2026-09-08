import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    department: z.string().min(1, "Department is required"),
});