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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-warning via-primary to-accent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-base-100/80 hover:bg-base-200 shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Banner Section */}
          <div className="w-full h-36 sm:h-44 bg-gradient-to-r from-warning/20 to-primary/20 relative overflow-hidden flex items-center justify-center">
            {vendor.banner ? (
              <img
                src={vendor.banner}
                alt={`${vendor.name} banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-base-content/30 flex items-center gap-2 font-bold text-sm">
                <Store className="w-6 h-6" />
                <span>Storefront Banner Unset</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Profile Header With Logo */}
          <div className="px-6 relative -mt-12 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-base-100 bg-white shadow-xl flex items-center justify-center shrink-0">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Store className="w-10 h-10 text-warning" />
                )}
              </div>
              <div className="space-y-1 pb-1">
                <h3 className="text-2xl font-black tracking-tight text-base-content">
                  {vendor.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-sm font-bold">
                    Partner Store
                  </span>
                  {!vendor.isDeleted ? (
                    <span className="badge badge-success badge-sm font-bold gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="badge badge-error badge-sm font-bold gap-1">
                      <AlertTriangle className="w-3 h-3" /> Suspended
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-base-content/50 pb-1">
              ID: {vendor._id}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 space-y-6 text-xs">
            {/* Contact & Location Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contact Card */}
              <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-warning" />
                  <span>Contact Information</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                    <a
                      href={`mailto:${vendor.email}`}
                      className="font-bold text-primary hover:underline truncate"
                    >
                      {vendor.email || "N/A"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                    <span className="font-medium text-base-content/90">
                      {vendor.phone || "No phone listed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-info" />
                  <span>Business Address</span>
                </div>
                <div className="space-y-1 text-base-content/80">
                  <p className="font-bold">{vendor.address?.street || "Street Unassigned"}</p>
                  <p>
                    {[vendor.address?.state, vendor.address?.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="font-bold text-primary">
                    {vendor.address?.country || "Country Unassigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* Governance & Timestamps */}
            <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Account Governance & Timestamps</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-base-content/50">Merchant Account ID</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                    <User className="w-3 h-3 text-warning" />
                    <span className="truncate">{typeof vendor.user === "object" ? (vendor.user as any)?._id : vendor.user || "N/A"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-base-content/50">Registration Date</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <Calendar className="w-3 h-3 text-base-content/40" />
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
                  <span className="text-[10px] text-base-content/50">Last Profile Update</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <Calendar className="w-3 h-3 text-base-content/40" />
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
          <div className="p-4 border-t border-base-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-outline font-bold px-5"
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
