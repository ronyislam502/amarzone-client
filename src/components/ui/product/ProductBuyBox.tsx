"use client";

import React from "react";
import {
  ProductBuyBoxProps,
  BuyBoxPrice,
  BuyBoxDelivery,
  BuyBoxStockStatus,
  BuyBoxQuantitySelector,
  BuyBoxInlinePayment,
  BuyBoxActions,
  BuyBoxFulfillment,
  BuyBoxAddToList,
} from "./buybox";

export type { ProductBuyBoxProps };

export {
  BuyBoxPrice,
  BuyBoxDelivery,
  BuyBoxStockStatus,
  BuyBoxQuantitySelector,
  BuyBoxInlinePayment,
  BuyBoxActions,
  BuyBoxFulfillment,
  BuyBoxAddToList,
};

export const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  dollars,
  cents,
  inventoryLoading,
  buyBox,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow,
  buyLoading,
  paymentEmail,
  setPaymentEmail,
  showInlinePayment,
  setShowInlinePayment,
  handlePayAndOrder,
  confirmLoading,
}) => {
  const sellerName = buyBox?.fulfillmentBy || buyBox?.vendor?.name || "Amarzone Verified Partner";

  return (
    <div className="border border-slate-200/90 rounded-3xl p-5 sm:p-6 bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Buy Box Price */}
      <div className="flex items-center justify-between">
        <BuyBoxPrice dollars={dollars} cents={cents} />
        <BuyBoxStockStatus
          inventoryLoading={inventoryLoading}
          isStock={buyBox?.isStock}
        />
      </div>

      {/* Delivery & Shipping Info */}
      <BuyBoxDelivery />

      {/* Quantity Stepper */}
      <BuyBoxQuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        disabled={showInlinePayment}
      />

      {/* Primary Actions / Inline Payment Option */}
      {showInlinePayment ? (
        <BuyBoxInlinePayment
          paymentEmail={paymentEmail}
          setPaymentEmail={setPaymentEmail}
          buyLoading={buyLoading}
          confirmLoading={confirmLoading}
          onCancel={() => setShowInlinePayment(false)}
          handlePayAndOrder={handlePayAndOrder}
        />
      ) : (
        <BuyBoxActions
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          isStock={buyBox?.isStock}
          buyLoading={buyLoading}
        />
      )}

      {/* Seller & Fulfillment Information */}
      <BuyBoxFulfillment sellerName={sellerName} />

      {/* Add to Registry / List */}
      <BuyBoxAddToList />
    </div>
  );
};

export default ProductBuyBox;
