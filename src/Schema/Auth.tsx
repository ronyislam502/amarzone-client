import { z } from "zod";

export const loginValidationSchema = z.object({
    email: z.string(),
    password: z
        .string()
        .trim()
        .min(6, "Password needs to be at lest 6 character"),
});