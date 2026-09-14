'use client';

import React, { useState } from 'react';
import { Package, Truck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdateOrderShippingMutation, useUpdateOrderTrackingMutation } from '@/src/redux/features/order/orderApi';
import { Order } from '@/src/types/order';

interface UpdateOrderProps {
  order?: Order | any | null;
  onSuccess?: () => void;
}

const UpdateOrder: React.FC<UpdateOrderProps> = ({ order, onSuccess }) => {
  const [status, setStatus] = useState<string>(order?.status || 'UNSHIPPED');
  const [courierName, setCourierName] = useState<string>(order?.tracking?.courierName || 'FedEx Standard');
  const [trackingNumber, setTrackingNumber] = useState<string>(order?.tracking?.trackingNumber || '');
  const [notes, setNotes] = useState<string>(order?.tracking?.notes || '');

  const [updateShipping, { isLoading: isUpdatingShipping }] = useUpdateOrderShippingMutation();
  const [updateTracking, { isLoading: isUpdatingTracking }] = useUpdateOrderTrackingMutation();

  const isSubmitting = isUpdatingShipping || isUpdatingTracking;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order?._id && !order?.id) {
      toast.error('Order ID not found');
      return;
    }

    const orderId = order._id || order.id;

    try {
      // 1. Update shipping status if modified
      if (status) {
        await updateShipping({
          id: orderId,
          data: { status },
        }).unwrap();
      }

      // 2. Update tracking details if provided
      if (trackingNumber.trim()) {
        await updateTracking({
          id: orderId,
          data: {
            trackingNumber: trackingNumber.trim(),
            courierName: courierName.trim(),
            notes: notes.trim(),
          },
        }).unwrap();
      }

      toast.success('Order fulfillment updated successfully!');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to update order fulfillment');
    }
  };

  const productItem = order?.products?.[0];
  const prodObj = productItem?.variant?.product || productItem?.product;
  const prodTitle = prodObj?.title || order?.product?.title || 'Order Product Item';
  const prodThumb =
    prodObj?.thumbnail ||
    productItem?.variant?.thumbnail ||
    order?.product?.thumbnail;

  return (
    <div className="w-full max-w-lg mx-auto text-slate-100 p-1">
      {/* Header */}
      <div className="text-center sm:text-left mb-6">
        <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-semibold mb-3 bg-amber-400/20 border-amber-400/30 text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fulfillment Management</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-amber-400" />
          <span>Update Order #{order?.orderNo || order?.id?.slice(-8)}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Confirm carrier dispatch, add tracking numbers, and update delivery status.
        </p>
      </div>

      {/* Product Summary */}
      <div className="p-3.5 rounded-2xl bg-[#120824] border border-white/10 mb-5 flex items-center gap-3">
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
            <span>Amount: <strong className="text-amber-400">${order?.vendorAmount || order?.totalPrice || order?.product?.subtotal || 0}</strong></span>
            <span>•</span>
            <span>Qty: <strong className="text-white">{order?.totalQuantity || productItem?.quantity || order?.product?.quantity || 1}</strong></span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status Selection */}
        <div className="form-control w-full">
          <label className="label text-xs font-bold text-slate-300">Fulfillment Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered w-full bg-[#120824] border-white/15 text-slate-200 focus:border-amber-400 text-xs rounded-xl"
          >
            <option value="PENDING">PENDING (Awaiting payment verification)</option>
            <option value="UNSHIPPED">UNSHIPPED (Ready to pack & dispatch)</option>
            <option value="SHIPPED">SHIPPED (Handed over to carrier)</option>
            <option value="IN_TRANSIT">IN_TRANSIT (In carrier transit)</option>
            <option value="DELIVERED">DELIVERED (Fulfillment completed)</option>
            <option value="CANCELLED">CANCELLED (Order voided)</option>
          </select>
        </div>

        {/* Courier Name */}
        <div className="form-control w-full">
          <label className="label text-xs font-bold text-slate-300">Courier / Carrier</label>
          <input
            type="text"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            placeholder="e.g., FedEx, DHL, USPS, UPS..."
            className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 text-xs rounded-xl"
          />
        </div>

        {/* Tracking Number */}
        <div className="form-control w-full">
          <label className="label text-xs font-bold text-slate-300">Tracking Number</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g., TRK-9281749102"
            className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 text-xs rounded-xl"
          />
        </div>

        {/* Notes */}
        <div className="form-control w-full">
          <label className="label text-xs font-bold text-slate-300">Fulfillment Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g., Dispatched via priority air freight."
            className="textarea textarea-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 text-xs rounded-xl"
          />
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black border-none rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {isSubmitting ? 'Updating...' : 'Save Order Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;
