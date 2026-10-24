import { TUser } from "./user";

export type TOrderDashboardRole = "ADMIN" | "VENDOR" | "CUSTOMER";

export type TTracking = {
    trackingNumber: string;
    courierName: string;
    shippedBy?: string;
    shippedAt?: string | Date;
    estimatedDelivery?: string | Date;
    deliveredAt?: string | Date;
};

export type TOrderProductVariant = {
    _id: string;
    sku?: string;
    price?: number;
    product?: {
        _id: string;
        title: string;
        thumbnail?: string;
        department?: { _id: string; name: string } | string;
        category?: { _id: string; name: string } | string;
    };
};

export type TOrderProduct = {
    variant: TOrderProductVariant;
    quantity: number;
    price?: number;
};

export type TOrderCustomer = {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
};

export type TOrderVendor = {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    logo?: string;
};

export type TOrder = {
    _id: string;
    orderNo: string;
    customer: TOrderCustomer | TUser;
    vendor: TOrderVendor | TUser;
    products: TOrderProduct[];
    commission: number;
    tax: number;
    totalPrice: number;
    totalQuantity: number;
    vendorAmount: number;
    status:
        | "PENDING"
        | "UNSHIPPED"
        | "SHIPPED"
        | "IN_TRANSIT"
        | "DELIVERED"
        | "CANCELLED"
        | "OUT_OF_DELIVERY"
        | "REFUNDED"
        | string;
    paymentStatus: "PENDING" | "PAID" | "UNPAID" | "REFUNDED" | string;
    tracking?: TTracking;
    invoiceUrl?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
