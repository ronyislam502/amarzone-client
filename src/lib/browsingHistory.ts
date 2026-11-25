/**
 * Browsing History localStorage Utility
 * Stores and retrieves recently viewed product variants on the client side.
 */

const STORAGE_KEY = "az_browsing_history";
const MAX_HISTORY = 50; // Keep last 50 viewed products
const HISTORY_EVENT = "az:browsingHistoryUpdated";

export interface BrowsingHistoryItem {
    /** Variant _id (primary lookup key) */
    variantId: string;
    /** Parent product _id */
    productId: string;
    vendorId?: string;
    title: string;
    brand?: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    totalReviews?: number;
    categoryId?: string;
    categoryName?: string;
    departmentId?: string;
    isBestSeller?: boolean;
    asin?: string;
    attributes?: { type: string; value: string }[];
    /** ISO timestamp — most recent view comes first */
    viewedAt: string;
}

export interface BrowsingHistoryCardProduct {
    _id: string;
    variantId: string;
    productId: string;
    vendorId: string;
    title: string;
    brand: string;
    thumbnail: string;
    image: string;
    images: string[];
    price: number;
    oldPrice?: number;
    discountPercentage: number;
    rating: number;
    averageRating: number;
    totalReviews: number;
    isBestSeller: boolean;
    category?: { _id: string; name: string };
    asin?: string;
    attributes: { type: string; value: string }[];
    viewedAt: string;
}

/** Safe wrapper — no crash if localStorage is unavailable (SSR guard). */
function safeStorage() {
    try {
        return typeof window !== "undefined" ? window.localStorage : null;
    } catch {
        return null;
    }
}

/** Read the full history array from localStorage. */
export function getBrowsingHistory(): BrowsingHistoryItem[] {
    const storage = safeStorage();
    if (!storage) return [];
    try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/** Save a viewed product into localStorage browsing history. */
export function recordProductView(item: Omit<BrowsingHistoryItem, "viewedAt">): void {
    const storage = safeStorage();
    if (!storage || !item.variantId || !item.productId) return;

    try {
        const history = getBrowsingHistory();

        // Remove any existing entry for this variant so we can re-insert at front
        const filtered = history.filter((h) => h.variantId !== item.variantId);

        const newEntry: BrowsingHistoryItem = {
            ...item,
            viewedAt: new Date().toISOString(),
        };

        // Most-recently viewed at index 0
        const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);

        storage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(HISTORY_EVENT));
    } catch {
        // Ignore storage quota errors silently
    }
}

/** Clear all browsing history. */
export function clearBrowsingHistory(): void {
    const storage = safeStorage();
    if (!storage) return;
    try {
        storage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(HISTORY_EVENT));
    } catch {
        // noop
    }
}

/**
 * Get IDs of recently viewed products.
 * Returns an array of productIds (deduplicated, most-recent first).
 */
export function getRecentProductIds(limit = 20): string[] {
    const history = getBrowsingHistory();
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const item of history) {
        if (!seen.has(item.productId)) {
            seen.add(item.productId);
            ids.push(item.productId);
        }
        if (ids.length >= limit) break;
    }
    return ids;
}

/**
 * Returns the browsing history formatted as AZProductCard-compatible product objects.
 * These are plain objects derived purely from localStorage — no API call needed.
 */
export function getBrowsingHistoryAsProducts(limit = 30): BrowsingHistoryCardProduct[] {
    const history = getBrowsingHistory().slice(0, limit);
    return history.map((item) => ({
        _id: item.variantId,
        variantId: item.variantId,
        productId: item.productId,
        vendorId: item.vendorId || "",
        title: item.title,
        brand: item.brand || "",
        thumbnail: item.thumbnail,
        image: item.thumbnail,
        images: [item.thumbnail],
        price: item.price,
        oldPrice: item.originalPrice,
        discountPercentage:
            item.originalPrice && item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0,
        rating: item.rating || 0,
        averageRating: item.rating || 0,
        totalReviews: item.totalReviews || 0,
        isBestSeller: item.isBestSeller || false,
        category: item.categoryId
            ? { _id: item.categoryId, name: item.categoryName || "" }
            : undefined,
        asin: item.asin,
        attributes: item.attributes || [],
        viewedAt: item.viewedAt,
    }));
}

const EMPTY_PRODUCTS: BrowsingHistoryCardProduct[] = [];
let cachedRaw: string | null = null;
let cachedProducts: BrowsingHistoryCardProduct[] = EMPTY_PRODUCTS;

/** Referentially stable snapshot for React useSyncExternalStore. */
export function getBrowsingHistorySnapshot(): BrowsingHistoryCardProduct[] {
    const storage = safeStorage();
    if (!storage) return EMPTY_PRODUCTS;
    try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) {
            cachedRaw = null;
            cachedProducts = EMPTY_PRODUCTS;
            return EMPTY_PRODUCTS;
        }
        if (raw === cachedRaw) {
            return cachedProducts;
        }
        cachedRaw = raw;
        cachedProducts = getBrowsingHistoryAsProducts(50);
        return cachedProducts;
    } catch {
        return EMPTY_PRODUCTS;
    }
}

/** SSR snapshot always returns an empty array to avoid hydration mismatch. */
export function getBrowsingHistoryServerSnapshot(): BrowsingHistoryCardProduct[] {
    return EMPTY_PRODUCTS;
}

/** Subscribe to client-side browsing history updates across tabs and within the same tab. */
export function subscribeBrowsingHistory(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(HISTORY_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
        window.removeEventListener(HISTORY_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}
