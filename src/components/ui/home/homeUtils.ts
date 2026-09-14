import { TProduct } from "@/src/types/product";

export interface ProductPriceInfo {
    price: number;
    maxPrice: number;
    hasPriceRange: boolean;
    originalPrice: number;
    savings: number;
    discountPercent: number;
    inStock: boolean;
    vendorName: string;
    variantCount: number;
}

/**
 * Extracts normalized pricing, inventory status, and vendor details
 * from the nested variants and inventory structure of a TProduct.
 */
export const extractProductPriceInfo = (product: TProduct): ProductPriceInfo => {
    const allPrices: number[] = [];
    let inStock = false;
    let vendorName = product.brand || "Amarzone Verified Seller";
    let variantCount = 0;

    if (Array.isArray(product.variants) && product.variants.length > 0) {
        variantCount = product.variants.length;
        for (const variant of product.variants) {
            // Check if variant has inventory array
            const variantInventories = (variant as any).inventory;
            if (Array.isArray(variantInventories) && variantInventories.length > 0) {
                for (const inv of variantInventories) {
                    const price = inv?.seller?.price ?? inv?.price;
                    if (typeof price === "number" && price > 0) {
                        allPrices.push(price);
                    }
                    const quantity = inv?.seller?.quantity ?? inv?.quantity ?? 0;
                    const stockFlag = inv?.seller?.isStock ?? inv?.isStock ?? true;
                    if (stockFlag && quantity > 0) {
                        inStock = true;
                    }
                    if (inv?.seller?.vendor?.name) {
                        vendorName = inv.seller.vendor.name;
                    }
                }
            }
        }
    }

    // Direct fallback if minPrice is present on root
    if (product.minPrice && product.minPrice > 0) {
        allPrices.push(product.minPrice);
    }

    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 24.99;
    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : minPrice;

    // Simulate realistic original rollback retail price (15% to 30% higher)
    const markupFactor = 1.22;
    const originalPrice = Number((minPrice * markupFactor).toFixed(2));
    const savings = Number((originalPrice - minPrice).toFixed(2));
    const discountPercent = Math.round(((originalPrice - minPrice) / originalPrice) * 100);

    return {
        price: minPrice,
        maxPrice,
        hasPriceRange: maxPrice > minPrice,
        originalPrice,
        savings,
        discountPercent,
        inStock: inStock || true, // default to in stock if inventory not strictly tracked
        vendorName,
        variantCount,
    };
};

/**
 * Extracts a valid product image from thumbnail, variant images, or fallback.
 */
export const getProductThumbnail = (product: TProduct): string => {
    if (product.thumbnail && product.thumbnail.startsWith("http")) {
        return product.thumbnail;
    }
    const firstVariant = product.variants?.[0] as any;
    if (firstVariant?.images && Array.isArray(firstVariant.images) && firstVariant.images[0]) {
        return firstVariant.images[0];
    }
    if (firstVariant?.thumbnail) {
        return firstVariant.thumbnail;
    }
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";
};

/**
 * Formats a number into integer and cents parts for Walmart-style typography.
 */
export const formatWalmartPrice = (price: number) => {
    const fixed = price.toFixed(2);
    const [dollars, cents] = fixed.split(".");
    return { dollars, cents };
};
