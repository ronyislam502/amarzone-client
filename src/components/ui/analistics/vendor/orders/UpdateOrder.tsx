'use client';

import React, { useState } from 'react';
import {
  Package,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Hash,
  Clock,
  Calendar,
  Send,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdateOrderMutation } from '@/src/redux/features/order/orderApi';
import { TOrder } from '@/src/types/order';

interface UpdateOrderProps {
  order?: TOrder | any | null;
  onSuccess?: () => void;
}

const POPULAR_COURIERS = [
  'FedEx Express',
  'DHL Express',
  'UPS Ground',
  'USPS Priority',
  'Royal Mail',
  'Amazon Logistics',
];

const UpdateOrder: React.FC<UpdateOrderProps> = ({ order, onSuccess }) => {
  const [courierName, setCourierName] = useState<string>(
    order?.tracking?.courierName || 'FedEx Express'
  );
  const [trackingNumber, setTrackingNumber] = useState<string>(
    order?.tracking?.trackingNumber || ''
  );

  const [updateOrder, { isLoading: isSubmitting }] = useUpdateOrderMutation();

  const handleQuickCourier = (carrier: string) => {
    setCourierName(carrier);
  };

  const handleGenerateTracking = () => {
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    const prefix = courierName.toUpperCase().slice(0, 3).replace(/\s+/g, '') || 'TRK';
    setTrackingNumber(`${prefix}-${randomDigits}`);
    toast.info('Generated mock tracking number for testing.', { autoClose: 1800 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order?._id && !order?.id) {
      toast.error('Order ID not found');
      return;
    }

    if (!courierName.trim()) {
      toast.error('Please enter or select a courier name');
      return;
    }

    if (!trackingNumber.trim()) {
      toast.error('Please enter a valid tracking number');
      return;
    }

    const orderId = order._id || order.id;

    try {
      await updateOrder({
        id: orderId,
        data: {
          courierName: courierName.trim(),
          trackingNumber: trackingNumber.trim(),
        },
      }).unwrap();

      toast.success('Order dispatched & tracking assigned successfully! Marked as SHIPPED.', {
        position: 'top-right',
        autoClose: 3000,
      });
      onSuccess?.();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to update order tracking details'
      );
    }
  };

  const productItem = order?.products?.[0];
  const prodObj = productItem?.variant?.product || productItem?.product;
  const prodTitle = prodObj?.title || order?.product?.title || 'Order Item';
  const prodThumb =
    prodObj?.thumbnail ||
    productItem?.variant?.thumbnail ||
    order?.product?.thumbnail;

  const currentStatus = order?.status?.toUpperCase() || 'UNSHIPPED';

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'DELIVERED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'OUT_OF_DELIVERY':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'IN_TRANSIT':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'SHIPPED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'UNSHIPPED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'REFUNDED':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-slate-100 p-1">
      {/* Header */}
      <div className="text-center sm:text-left mb-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400/20 border-amber-400/30 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fulfillment Dispatch</span>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
              currentStatus
            )}`}
          >
            Status: {currentStatus}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-amber-400 shrink-0" />
          <span className="truncate">Dispatch Order #{order?.orderNo || order?.id?.slice(-8)}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Assign carrier tracking details to dispatch this package to the customer.
        </p>
      </div>

      {/* Product Summary Card */}
      <div className="p-3.5 rounded-2xl bg-[#120824] border border-white/10 mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
          {prodThumb ? (
            <img src={prodThumb} alt={prodTitle} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-5 h-5 text-slate-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white truncate">{prodTitle}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
            <span>
              Total:{' '}
              <strong className="text-amber-400">
                ${order?.vendorAmount || order?.totalPrice || order?.product?.subtotal || 0}
              </strong>
            </span>
            <span>•</span>
            <span>
              Qty:{' '}
              <strong className="text-white">
                {order?.totalQuantity || productItem?.quantity || order?.product?.quantity || 1}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Server Automated Schedule Notice */}
      <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 text-xs mb-5 flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-cyan-300">Automated 5-Day Delivery Schedule</p>
          <p className="text-cyan-200/80 leading-relaxed text-[11px]">
            Once tracking is assigned, the order status switches to <strong>SHIPPED</strong>.
            Progress through <em>In Transit</em>, <em>Out for Delivery</em>, and auto-completion as{' '}
            <strong>DELIVERED</strong> after 5 days is managed automatically by the server.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Courier Name */}
        <div className="form-control w-full space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Courier / Carrier Service</span>
          </label>

          <input
            type="text"
            required
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            placeholder="e.g., FedEx Express, DHL, UPS, USPS..."
            className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 text-xs rounded-xl"
          />

          {/* Quick Carrier Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {POPULAR_COURIERS.map((carrier) => (
              <button
                key={carrier}
                type="button"
                onClick={() => handleQuickCourier(carrier)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  courierName === carrier
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                {carrier}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Number */}
        <div className="form-control w-full space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              <span>Waybill / Tracking Number</span>
            </label>

            <button
              type="button"
              onClick={handleGenerateTracking}
              className="text-[10px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Generate Sample #</span>
            </button>
          </div>

          <input
            type="text"
            required
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g., FDX-9821387401"
            className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-200 font-mono placeholder:text-slate-500 focus:border-amber-400 text-xs rounded-xl"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black border-none rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Order Tracking...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Assign Tracking & Dispatch Order</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;

