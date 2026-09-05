import { z } from "zod";


export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .trim()
        .min(6, "Password needs to be at least 6 characters"),
});

export const customerRegisterSchema = z
    .object({
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

export const vendorRegisterSchema = z
    .object({
        name: z.string().min(1, "Store owner name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(6, "Phone number must be at least 6 digits"),
        street: z.string().min(1, "Street address is required"),
        state: z.string().min(1, "State or city is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().min(1, "Country is required"),
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

export const registerSchema = vendorRegisterSchema;

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        newPassword: z
            .string()
            .trim()
            .min(4, "Password must be at least 6 characters long"),
        confirmPassword: z.string().trim().min(1, "Please confirm your password"),
    });