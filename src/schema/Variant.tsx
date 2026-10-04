import { z } from "zod";

export const variantAttributeSchema = z.object({
    type: z.string().trim().min(1, "Attribute type is required"),
    value: z.string().trim().min(1, "Attribute value is required"),
});

export const variantSchema = z.object({
    product: z.string().min(1, "Product is required"),
    attributes: z
        .array(variantAttributeSchema)
        .min(1, "At least one variant attribute is required"),
    isPrivateLevel: z.boolean(),
});
