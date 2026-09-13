"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ExternalLink, HelpCircle, Package, AlertCircle } from "lucide-react";

export interface TPendingOrderRecord {
  id: string;
  orderNo: string;
  orderDate: {
    relative: string;
    date: string;
    time: string;
  };
  fulfillmentMethod: string;
  salesChannel: string;
  product: {
    title: string;
    thumbnail: string;
    asin: string;
    sku: string;
    quantity: number;
    subtotal: number;
  };
  orderType: string;
  status: "Pending" | "Unshipped" | "Shipped" | "Cancelled";
  statusSubtext: string;
}

interface PendingOrdersTableProps {
  orders: TPendingOrderRecord[];
  isLoading?: boolean;
  onOrderClick?: (order: TPendingOrderRecord) => void;
}

export const PendingOrdersTable: React.FC<PendingOrdersTableProps> = ({
  orders,
  isLoading = false,
  onOrderClick,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);

  const allSelected = orders.length > 0 && selectedIds.length === orders.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl">
      {/* Top glowing accent border line matching Categories */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 overflow-x-auto">
        <table className="table w-full text-left border-collapse">
          {/* Table Header matching exact structure */}
          <thead>
            <tr className="bg-[#120826] text-slate-300 text-xs font-bold uppercase tracking-wider border-b border-white/10">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all orders"
                  className="checkbox checkbox-sm checkbox-warning rounded border-white/30"
                />
              </th>
              <th className="py-3 px-3 min-w-[130px]">Order date</th>
              <th className="py-3 px-3 min-w-[180px]">Order details</th>
              <th className="py-3 px-3 w-16 text-center">Image</th>
              <th className="py-3 px-3 min-w-[260px]">Product name</th>
              <th className="py-3 px-3 min-w-[130px]">Order type</th>
              <th className="py-3 px-3 min-w-[170px]">Order Status</th>
              <th className="py-3 px-3 text-right min-w-[110px]">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/5 text-xs text-slate-300">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-4">
                    <div className="w-4 h-4 bg-white/10 rounded" />
                  </td>
                  <td className="p-3 space-y-1">
                    <div className="w-20 h-3 bg-white/10 rounded" />
                    <div className="w-16 h-2 bg-white/10 rounded" />
                  </td>
                  <td className="p-3 space-y-1">
                    <div className="w-28 h-3 bg-white/10 rounded" />
                    <div className="w-24 h-2 bg-white/10 rounded" />
                  </td>
                  <td className="p-3">
                    <div className="w-11 h-11 bg-white/10 rounded-lg mx-auto" />
                  </td>
                  <td className="p-3 space-y-1.5">
                    <div className="w-48 h-3 bg-white/10 rounded" />
                    <div className="w-32 h-2 bg-white/10 rounded" />
                  </td>
                  <td className="p-3">
                    <div className="w-16 h-3 bg-white/10 rounded" />
                  </td>
                  <td className="p-3 space-y-1">
                    <div className="w-16 h-4 bg-white/10 rounded" />
                    <div className="w-24 h-2 bg-white/10 rounded" />
                  </td>
                  <td className="p-3 text-right">
                    <div className="w-16 h-3 bg-white/10 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  <div className="max-w-sm mx-auto space-y-2 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/20">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">No Pending Orders</div>
                    <p className="text-xs text-slate-400">
                      You currently have no orders awaiting payment verification. Check the Unshipped tab for ready orders.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                const isExpanded = expandedInfoId === order.id;

                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      isSelected ? "bg-amber-400/[0.04]" : ""
                    }`}
                  >
                    {/* 1. Checkbox */}
                    <td className="py-4 px-4 align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(order.id)}
                        aria-label={`Select order ${order.orderNo}`}
                        className="checkbox checkbox-sm checkbox-warning rounded border-white/30"
                      />
                    </td>

                    {/* 2. Order date */}
                    <td className="py-4 px-3 align-top whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-white text-xs">
                          {order.orderDate.relative}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          {order.orderDate.date}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.orderDate.time}
                        </div>
                      </div>
                    </td>

                    {/* 3. Order details */}
                    <td className="py-4 px-3 align-top">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => onOrderClick?.(order)}
                          className="font-black text-xs text-amber-400 hover:text-amber-300 hover:underline tracking-tight text-left cursor-pointer transition-colors"
                        >
                          {order.orderNo}
                        </button>
                        <div className="text-[11px] text-slate-300">
                          Fulfillment method:{" "}
                          <span className="font-semibold text-white">
                            {order.fulfillmentMethod}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Sales channel:{" "}
                          <span className="text-slate-300 font-medium">
                            {order.salesChannel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. Image */}
                    <td className="py-4 px-3 align-top text-center">
                      <div className="relative w-12 h-12 mx-auto rounded-lg overflow-hidden border border-white/15 bg-slate-900 shrink-0 shadow-sm">
                        {order.product.thumbnail ? (
                          <img
                            src={order.product.thumbnail}
                            alt={order.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 5. Product name & specs */}
                    <td className="py-4 px-3 align-top">
                      <div className="space-y-1 max-w-sm">
                        <a
                          href={`#product-${order.product.asin}`}
                          className="font-bold text-xs text-white hover:text-amber-400 line-clamp-2 transition-colors leading-snug"
                        >
                          {order.product.title}
                        </a>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400 pt-0.5">
                          <div>
                            ASIN:{" "}
                            <span className="font-semibold text-slate-200">
                              {order.product.asin}
                            </span>
                          </div>
                          <div>
                            SKU:{" "}
                            <span className="font-semibold text-slate-200">
                              {order.product.sku}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-300">
                          <div>
                            Quantity:{" "}
                            <span className="font-extrabold text-white">
                              {order.product.quantity}
                            </span>
                          </div>
                          <span className="text-white/20">•</span>
                          <div>
                            Item subtotal:{" "}
                            <span className="font-extrabold text-amber-400">
                              ${order.product.subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 6. Order type */}
                    <td className="py-4 px-3 align-top whitespace-nowrap">
                      <span className="text-xs text-slate-200 font-medium">
                        {order.orderType}
                      </span>
                    </td>

                    {/* 7. Order Status */}
                    <td className="py-4 px-3 align-top">
                      <div className="space-y-1">
                        {/* Amber/Yellow Status Badge */}
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                          {order.status}
                        </span>

                        {/* Status Subtext with Chevron */}
                        <button
                          type="button"
                          onClick={() => setExpandedInfoId(isExpanded ? null : order.id)}
                          className="flex items-center gap-0.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors text-left"
                        >
                          <span>{order.statusSubtext}</span>
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Collapsible Info popover */}
                        {isExpanded && (
                          <div className="mt-1.5 p-2 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-[10px] text-cyan-200 space-y-1 shadow-lg animate-fadeIn">
                            <div className="font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span>Payment Verification in Progress</span>
                            </div>
                            <p className="text-slate-300 leading-normal">
                              The payment is undergoing customer authorization. Do not dispatch shipment until the status converts to Unshipped.
                            </p>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 8. Action */}
                    <td className="py-4 px-3 align-top text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOrderClick?.(order)}
                        className="text-xs text-slate-400 hover:text-amber-400 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>More information</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with More Information link matching reference image */}
      <div className="p-3 sm:p-4 bg-[#120826] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Showing {orders.length} order{orders.length === 1 ? "" : "s"}</span>
          {selectedIds.length > 0 && (
            <span className="badge badge-warning badge-sm font-bold text-slate-950">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        <a
          href="#more-info"
          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 hover:underline transition-colors cursor-pointer"
        >
          <span>More information</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default PendingOrdersTable;
