import { TVariant } from "./product";

export type TCartItem = {
    _id: string;
    productId?: string;
    variantId?: string;
    variant?: TVariant | any;
    title: string;
    thumbnail?: string;
    image?: string;
    brand?: string;
    category?: any;
    price: number;
    originalPrice?: number;
    quantity: number;
    maxQuantity?: number;
    seller?: any;
    vendor?: any;
    vendorId?: string;
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
