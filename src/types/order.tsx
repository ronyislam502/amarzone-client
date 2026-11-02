import { TVariant } from "./product";

/**
 * Lean cart item — only IDs + quantity are persisted in Redux.
 * Full product details (title, price, thumbnail, etc.) are fetched
 * at display-time in CartData.tsx using the stored IDs.
 */
export type TCartItem = {
    _id: string;          // product._id (required)
    variantId: string;    // variant._id (required — used to fetch inventory/price)
    vendorId: string;     // vendor user._id (required — used to group orders by vendor)
    quantity: number;     // ordered quantity
    // Optional enrichment fields populated at display-time (NOT persisted)
    productId?: string;
    variant?: TVariant | any;
    title?: string;
    thumbnail?: string;
    image?: string;
    brand?: string;
    category?: any;
    price?: number;
    originalPrice?: number;
    maxQuantity?: number;
    seller?: any;
    vendor?: any;
    inStock?: boolean;
    stockNote?: string;
    shippingTime?: number;
    attributes?: { type: string; value: string }[];
    isSelected?: boolean;
    [key: string]: any;
};


export type TCartState = {
    user: string | null;
    products: TCartItem[];
    foods?: TCartItem[];
    selectedItems: number;
    totalPrice: number;
    tax: number;
    grandTotal: number;
};


export type TOrder = {
    _id: string
    customer: TOdrCustomer
    vendor: TOdrVendor
    orderNo: string
    products: TOdrProduct[]
    commission: number
    tax: number
    totalPrice: number
    totalQuantity: number
    vendorAmount: number
    shippedDate: TOdrShippedDate
    deliveryDate: TOdrDeliveryDate
    status: string
    paymentStatus: string
    transactionId: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
    invoiceUrl: string
    tracking?: {
        trackingNumber?: string
        courierName?: string
        shippedBy?: string
        shippedAt?: string
        estimatedDelivery?: string
        deliveredAt?: string
        notes?: string
    }
}

export type Order = TOrder;



export type TOdrCustomer = {
    _id: string
    name: string
    email: string
}

export type TOdrVendor = {
    _id: string
    name: string
    email: string
}

export type TOdrProduct = {
    variant: any,
    quantity: number
    price: number
}

export type TOdrShippedDate = {
    from: string
    to: string
}

export type TOdrDeliveryDate = {
    from: string
    to: string
}


export interface TCartProduct extends Partial<TCartItem> {
    _id?: string;
    id?: string;
    productId?: string;
    variantId?: string;
    variant?: any;
    title?: string;
    brand?: string;
    category?: any;
    thumbnail?: string;
    image?: string;
    price?: number;
    originalPrice?: number;
    quantity: number;
    maxQuantity?: number;
    inStock?: boolean;
    stockNote?: string;
    variantInfo?: string;
    seller?: any;
    vendor?: any;
    vendorId?: string;
    sellerName?: string;
    fulfilledBy?: string;
    shippingTime?: number;
    attributes?: { type: string; value: string }[];
    isSelected?: boolean;
    isGift?: boolean;
}

/** Payload shape for the Create Order API endpoint */
export type TCreateOrderPayload = {
    vendor: string;
    products: {
        variant: string;
        quantity: number;
    }[];
};
