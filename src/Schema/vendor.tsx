import { z } from "zod";

export const addressValidationSchema = z.object({
    street: z.string().min(1, "Street address is required"),
    state: z.string().min(1, "State / City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
});

export const updateAddressValidationSchema = z.object({
    street: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
});

export const createVendorValidationSchema = z.object({
    name: z.string().min(1, "Vendor name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(6, "Phone number must be at least 6 characters"),
    address: addressValidationSchema,
    logo: z.string().optional(),
    banner: z.string().optional(),
});

export const updateVendorValidationSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    address: updateAddressValidationSchema.optional(),
    logo: z.string().optional(),
    banner: z.string().optional(),
    description: z.string().optional(),
});
