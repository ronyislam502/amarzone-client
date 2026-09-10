export type TVariantAttribute = {
    type: string;
    value: string;
};

export type TInventoryVariant = {
    _id: string;
    asin: string;
    sku: string;
    attributes: TVariantAttribute[];
    images: string[];
    isPrivateLevel: boolean;
    product?: {
        _id: string;
        title: string;
        brand: string;
        featuredImage?: string;
        thumbnail?: string;
    };
};

export type TSeller = {
    vendor: string | { _id: string; name: string; email: string };
    price: number;
    quantity: number;
    isStock: boolean;
    fulfillmentBy: string;
    shippingTime: number;
    isBuyBoxWinner?: boolean;
    _id?: string;
};

export type TInventory = {
    _id: string;
    variant: TInventoryVariant;
    asin: string;
    seller: TSeller;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
};