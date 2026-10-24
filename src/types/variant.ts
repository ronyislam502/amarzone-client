export type TVariantAttribute = {
    type: string;
    value: string;
};

export type TVariant = {
    _id?: string;
    asin?: string;
    attributes: TVariantAttribute[];
    images: string[];
    isDeleted?: boolean;
    isPrivateLevel?: boolean;
    product: string;
    sku?: string;
    isBuyBoxEligible?: boolean;
    price?: number;
    rating?: number;
    createdAt?: string;
    updatedAt?: string;
};
