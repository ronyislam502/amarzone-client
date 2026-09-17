"use client";

import {
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  User,
} from "lucide-react";
import { TVendor } from "@/types/vendor";

interface VendorDetailsModalProps {
  vendor: TVendor | null;
  isOpen: boolean;
  onClose: () => void;
}

const VendorDetailsModal = ({
  vendor,
  isOpen,
  onClose,
}: VendorDetailsModalProps) => {
  if (!isOpen || !vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="relative z-10 overflow-y-auto flex-1">
          {/* Banner Section */}
          <div className="w-full h-36 sm:h-44 bg-gradient-to-r from-amber-500/10 to-indigo-600/20 relative overflow-hidden flex items-center justify-center border-b border-white/10">
            {vendor.banner ? (
              <img
                src={vendor.banner}
                alt={`${vendor.name} banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-slate-400 flex items-center gap-2 font-bold text-sm">
                <Store className="w-6 h-6 text-amber-400" />
                <span>Storefront Banner Unset</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#170d2f] via-transparent to-transparent" />
          </div>

          {/* Profile Header With Logo */}
          <div className="px-6 relative -mt-12 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 bg-[#120824] shadow-2xl flex items-center justify-center shrink-0">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Store className="w-10 h-10 text-amber-400" />
                )}
              </div>
              <div className="space-y-1 pb-1">
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {vendor.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-sm font-black text-slate-950 shadow">
                    Partner Store
                  </span>
                  {!vendor.isDeleted ? (
                    <span className="badge badge-success badge-outline bg-success/10 border-success/30 text-success badge-sm font-bold gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="badge badge-error badge-outline bg-error/10 border-error/30 text-error badge-sm font-bold gap-1">
                      <AlertTriangle className="w-3 h-3" /> Suspended
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 pb-1">
              ID: {vendor._id}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 space-y-6 text-xs">
            {/* Contact & Location Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contact Card */}
              <div className="card bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Information</span>
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${vendor.email}`}
                      className="font-bold text-amber-400 hover:underline truncate"
                    >
                      {vendor.email || "N/A"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-200">
                      {vendor.phone || "No phone listed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="card bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Business Address</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <p className="font-bold text-white">{vendor.address?.street || "Street Unassigned"}</p>
                  <p>
                    {[vendor.address?.state, vendor.address?.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="font-bold text-amber-400">
                    {vendor.address?.country || "Country Unassigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* Governance & Timestamps */}
            <div className="card bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Account Governance & Timestamps</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Merchant Account ID</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-200">
                    <User className="w-3 h-3 text-amber-400" />
                    <span className="truncate">{typeof vendor.user === "object" ? (vendor.user as any)?._id : vendor.user || "N/A"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Registration Date</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>
                      {vendor.createdAt
                        ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Last Profile Update</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>
                      {vendor.updatedAt
                        ? new Date(vendor.updatedAt).toLocaleDateString("en-US", {
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
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-outline border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold px-6 cursor-pointer rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
