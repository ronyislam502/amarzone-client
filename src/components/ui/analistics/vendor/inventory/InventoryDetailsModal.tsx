"use client";

import { X, Layers, Trophy, Tag, Boxes, Truck, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { TInventory } from "@/src/types/inventory";

interface InventoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: TInventory | null;
  onOpenPriceModal?: () => void;
  onOpenStockModal?: () => void;
}

const InventoryDetailsModal = ({
  isOpen,
  onClose,
  inventory,
  onOpenPriceModal,
  onOpenStockModal,
}: InventoryDetailsModalProps) => {
  if (!isOpen || !inventory) return null;

  const product = inventory.variant?.product;
  const variant = inventory.variant;
  const seller = inventory.seller;
  const isWinner = Boolean(seller?.isBuyBoxWinner);
  const isStock = Boolean(seller?.isStock && (seller?.quantity || 0) > 0);

  const mainImage =
    variant?.images?.[0] ||
    product?.featuredImage ||
    product?.thumbnail ||
    "/placeholder.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-200 bg-base-200/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-base-content">
                  Inventory Specification
                </h3>
                {isWinner ? (
                  <span className="badge badge-primary badge-sm font-bold gap-1">
                    <Trophy className="w-3 h-3" /> Buy Box Winner
                  </span>
                ) : (
                  <span className="badge badge-ghost badge-sm text-base-content/60 font-semibold">
                    Standard Seller
                  </span>
                )}
              </div>
              <p className="text-xs text-base-content/60 font-mono mt-0.5">
                ASIN: <span className="font-bold text-accent">{inventory.asin}</span> | SKU: {variant?.sku || "N/A"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Product Overview Card */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-200 items-start sm:items-center">
            <div className="relative w-20 h-20 rounded-xl bg-base-100 border border-base-300 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={mainImage}
                alt={product?.title || "Product"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/100x100?text=Item";
                }}
              />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              {product?.brand && (
                <div className="text-[11px] font-black uppercase text-accent tracking-wider">
                  {product.brand}
                </div>
              )}
              <h4 className="text-sm sm:text-base font-bold text-base-content line-clamp-2">
                {product?.title || `Product (${inventory.asin})`}
              </h4>

              {/* Attributes badges */}
              {variant?.attributes && variant.attributes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {variant.attributes.map((attr, i) => (
                    <span
                      key={i}
                      className="badge badge-sm badge-outline text-[10px] font-bold border-base-300"
                    >
                      {attr.type}: <span className="text-base-content ml-1">{attr.value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Stock Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price Box */}
            <div className="p-4 bg-base-100 rounded-2xl border border-base-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-base-content/60 uppercase">
                  Your Listing Price
                </span>
                <div className="text-2xl font-black text-accent mt-0.5">
                  ${Number(seller?.price || 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-base-content/50 font-medium">
                  Currency: USD ($)
                </div>
              </div>
              {onOpenPriceModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPriceModal();
                  }}
                  className="btn btn-xs btn-outline border-accent/40 text-accent hover:bg-accent hover:text-white font-bold"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  Edit Price
                </button>
              )}
            </div>

            {/* Quantity Box */}
            <div className="p-4 bg-base-100 rounded-2xl border border-base-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-base-content/60 uppercase">
                  Current Stock Units
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className={`text-2xl font-black ${
                      (seller?.quantity || 0) === 0
                        ? "text-error"
                        : (seller?.quantity || 0) <= 5
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {seller?.quantity || 0}
                  </div>
                  <span
                    className={`badge badge-sm font-bold ${
                      isStock ? "badge-success text-white" : "badge-error text-white"
                    }`}
                  >
                    {isStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="text-[11px] text-base-content/50 font-medium">
                  {seller?.quantity && seller.quantity <= 5
                    ? "⚠️ Restock recommended"
                    : "Optimal stock health"}
                </div>
              </div>
              {onOpenStockModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStockModal();
                  }}
                  className="btn btn-xs btn-outline border-success/40 text-success hover:bg-success hover:text-white font-bold"
                >
                  <Boxes className="w-3 h-3 mr-1" />
                  Restock
                </button>
              )}
            </div>
          </div>

          {/* Fulfillment & Logistics */}
          <div className="p-4 bg-base-200/40 rounded-2xl border border-base-200 space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-base-content/70">
              Fulfillment & Logistics
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <div className="text-base-content/60">Fulfillment Provider:</div>
                  <div className="font-bold text-base-content">
                    {seller?.fulfillmentBy || "Merchant Fulfillment"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-info shrink-0" />
                <div>
                  <div className="text-base-content/60">Handling & Transit:</div>
                  <div className="font-bold text-base-content">
                    {seller?.shippingTime || 3} business days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="text-[11px] text-base-content/50 border-t border-base-200 pt-3 flex flex-wrap justify-between gap-2">
            <span>Listing ID: {inventory._id}</span>
            <span>
              Updated: {new Date(inventory.updatedAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-base-200 bg-base-200/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsModal;
