export interface HotReleaseProduct {
    id: string;
    rank?: number; // #1 to #8
    title: string;
    brand: string;
    category: string;
    image: string;
    rating: number;
    reviewCount: number;
    price: number;
    originalPrice?: number;
    badge?: string;
    releaseDate: string;
    tag: string;
    stockRemaining: number;
    totalStock: number;
    description: string;
}

export type ReleaseProduct = HotReleaseProduct;

export interface DepartmentCategory {
    id: string;
    name: string;
    items: HotReleaseProduct[];
}
