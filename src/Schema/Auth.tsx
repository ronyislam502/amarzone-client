import { z } from "zod";

export const loginValidationSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .trim()
        .min(6, "Password needs to be at least 6 characters"),
});

export const forgotPasswordValidationSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

export const resetPasswordValidationSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        newPassword: z
            .string()
            .trim()
            .min(4, "Password must be at least 6 characters long"),
        confirmPassword: z.string().trim().min(1, "Please confirm your password"),
    });

export const registerValidationSchema = z
    .object({
        role: z.enum(["customer", "vendor"]).optional(),
        name: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(4, "Phone number is required"),
        street: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        password: z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().trim().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

