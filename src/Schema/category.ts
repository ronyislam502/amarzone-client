import { z } from "zod";

export const categoryValidationSchema = z.object({
    name: z.string().min(1, "Category name is required"),
    department: z.string().min(1, "Department is required"),
});
