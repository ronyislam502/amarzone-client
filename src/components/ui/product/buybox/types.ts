import { TSeller } from "@/types/inventory";

export interface BuyBoxPriceProps {
  dollars: string;
  cents: string;
}

export interface BuyBoxDeliveryProps {
  deliveryDate?: string;
  cutoffText?: string;
  location?: string;
}

export interface BuyBoxStockStatusProps {
  inventoryLoading: boolean;
  isStock?: boolean;
}

export interface BuyBoxQuantitySelectorProps {
  quantity: number;
  setQuantity: (q: number) => void;
  disabled?: boolean;
}

export interface BuyBoxInlinePaymentProps {
  paymentEmail: string;
  setPaymentEmail: (email: string) => void;
  buyLoading: boolean;
  confirmLoading: boolean;
  onCancel: () => void;
  handlePayAndOrder: (stripe: any, elements: any, cardElement: any) => void;
}

export interface BuyBoxActionsProps {
  handleAddToCart: (vendorName?: string) => void;
  handleBuyNow: () => void;
  isStock?: boolean;
  buyLoading: boolean;
}

export interface BuyBoxFulfillmentProps {
  sellerName?: string;
  returnsPolicy?: string;
}

export interface BuyBoxAddToListProps {
  onAddToList?: () => void;
}

export interface ProductBuyBoxProps {
  dollars: string;
  cents: string;
  inventoryLoading: boolean;
  buyBox?: TSeller;
  quantity: number;
  setQuantity: (q: number) => void;
  handleAddToCart: (vendorName?: string) => void;
  handleBuyNow: () => void;
  buyLoading: boolean;

  // Inline Payment props
  paymentEmail: string;
  setPaymentEmail: (email: string) => void;
  showInlinePayment: boolean;
  setShowInlinePayment: (show: boolean) => void;
  handlePayAndOrder: (stripe: any, elements: any, cardElement: any) => void;
  confirmLoading: boolean;
}
