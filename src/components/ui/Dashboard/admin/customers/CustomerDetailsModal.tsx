"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
} from "lucide-react";
import { TCustomer } from "@/types/customer";

interface CustomerDetailsModalProps {
  customer: TCustomer | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsModal = ({
  customer,
  isOpen,
  onClose,
}: CustomerDetailsModalProps) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-info via-primary to-accent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-base-100/80 hover:bg-base-200 shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 text-xs">
          {/* Header Profile Section */}
          <div className="flex items-center gap-4 border-b border-base-200 pb-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-info/30 bg-base-200 shadow-md flex items-center justify-center shrink-0">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-info/10 text-info flex items-center justify-center text-2xl font-black">
                  {customer.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
              )}
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="badge badge-info badge-sm font-bold text-white">
                  Shopper Profile
                </span>
                {!customer.isDeleted ? (
                  <span className="badge badge-success badge-sm font-bold gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="badge badge-error badge-sm font-bold gap-1">
                    <AlertTriangle className="w-3 h-3" /> Suspended
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-base-content truncate">
                {customer.name}
              </h3>
              <p className="text-[11px] font-mono text-base-content/50">
                Customer ID: {customer._id}
              </p>
            </div>
          </div>

          {/* Contact & Shipping Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Card */}
            <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-info" />
                <span>Contact Channels</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="font-bold text-primary hover:underline truncate"
                  >
                    {customer.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                  <span className="font-medium text-base-content/90">
                    {customer.phone || "No telephone provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-success" />
                <span>Default Shipping Address</span>
              </div>
              <div className="space-y-1 text-base-content/80">
                <p className="font-bold">{customer.address?.street || "Street Unassigned"}</p>
                <p>
                  {[customer.address?.state, customer.address?.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="font-bold text-info">
                  {customer.address?.country || "Country Unassigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Governance & Timestamps */}
          <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
            <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Consumer Governance Metadata</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-base-content/50">Auth User Reference</span>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                  <User className="w-3 h-3 text-info" />
                  <span className="truncate">
                    {typeof customer.user === "object"
                      ? (customer.user as any)?._id
                      : customer.user || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-base-content/50">Account Created</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <Calendar className="w-3 h-3 text-base-content/40" />
                  <span>
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-base-content/50">Profile Updated</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <Calendar className="w-3 h-3 text-base-content/40" />
                  <span>
                    {customer.updatedAt
                      ? new Date(customer.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-base-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-outline font-bold px-6"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
