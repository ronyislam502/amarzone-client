import { TCartItem } from "@/types/order";

export interface TCartProduct extends Partial<TCartItem> {
  _id?: string;
  id?: string;
  productId?: string;
  variantId?: string;
  variant?: any;
  title: string;
  brand?: string;
  category?: any;
  thumbnail?: string;
  image?: string;
  price: number;
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
