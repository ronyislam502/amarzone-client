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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-xl max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="relative z-10 overflow-y-auto flex-1 p-6 space-y-6 text-xs">
          {/* Header Profile Section */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/15 bg-[#120824] shadow-md flex items-center justify-center shrink-0">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center text-2xl font-black">
                  {customer.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
              )}
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="badge badge-warning badge-sm font-black text-slate-950">
                  Shopper Profile
                </span>
                {!customer.isDeleted ? (
                  <span className="badge badge-sm font-bold gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="badge badge-sm font-bold gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-3 h-3" /> Suspended
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white truncate">
                {customer.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Customer ID: {customer._id}
              </p>
            </div>
          </div>

          {/* Contact & Shipping Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Card */}
            <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Channels</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="font-bold text-amber-400 hover:underline truncate"
                  >
                    {customer.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-200">
                    {customer.phone || "No telephone provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Default Shipping Address</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <p className="font-bold text-white">{customer.address?.street || "Street Unassigned"}</p>
                <p>
                  {[customer.address?.state, customer.address?.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="font-bold text-amber-400">
                  {customer.address?.country || "Country Unassigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Governance & Timestamps */}
          <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-3">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Consumer Governance Metadata</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Auth User Reference</span>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-200">
                  <User className="w-3 h-3 text-amber-400" />
                  <span className="truncate">
                    {typeof customer.user === "object"
                      ? (customer.user as any)?._id
                      : customer.user || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Account Created</span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                  <Calendar className="w-3 h-3 text-slate-400" />
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
                <span className="text-[10px] text-slate-400">Profile Updated</span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                  <Calendar className="w-3 h-3 text-slate-400" />
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
          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-outline font-bold px-6 border-white/20 text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-all"
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
