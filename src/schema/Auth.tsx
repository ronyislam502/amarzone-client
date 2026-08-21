import { z } from "zod";


export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .trim()
        .min(6, "Password needs to be at least 6 characters"),
});