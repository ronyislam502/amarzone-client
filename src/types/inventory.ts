import { TVariant } from "./product";
import { TVendor } from "./vendor";

export type TSeller = {
    vendor: string | TVendor;
    price: number;
    quantity: number;
    isStock: boolean;
    fulfillmentBy: string;
    shippingTime: number;
    isBuyBoxWinner?: boolean;
};

export type TInventory = {
    _id?: string;
    variant: string | TVariant;
    asin: string;
    seller: TSeller;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type TListProductPayload = {
    asin: string;
    seller: {
        price: number;
        quantity: number;
        fulfillmentBy?: string;
        shippingTime?: number;
    };
};

export type TVariantInventoryData = {
    asin: string;
    buyBoxWinner?: TSeller | null;
    totalSellers: number;
    sellers: TInventory[];
    isVariantBuyBoxEligible?: boolean;
    variantDeliveredOrdersCount?: number;
};
