"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Store,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { TVendor } from "@/src/types/vendor";

interface VendorProfileHeaderProps {
  vendorProfile: TVendor;
  onOpenEditModal: () => void;
  onRefreshProfile: () => void;
  isRefreshingProfile: boolean;
}

const VendorProfileHeader = ({
  vendorProfile,
  onOpenEditModal,
  onRefreshProfile,
  isRefreshingProfile,
}: VendorProfileHeaderProps) => {
  const [hasCopiedVendorId, setHasCopiedVendorId] = useState<boolean>(false);

  const vendorDisplayName = vendorProfile.name || "Merchant Store";
  const vendorFirstLetter = vendorDisplayName.charAt(0).toUpperCase() || "V";
  const vendorIdString = vendorProfile._id || "";

  const handleCopyVendorId = async () => {
    if (!vendorIdString) return;
    try {
      await navigator.clipboard.writeText(vendorIdString);
      setHasCopiedVendorId(true);
      setTimeout(() => {
        setHasCopiedVendorId(false);
      }, 2000);
    } catch {
      // Clipboard write fallback
    }
  };

  const formattedPartnerDate = vendorProfile.createdAt
    ? new Date(vendorProfile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Verified Partner";

  const isStoreAccountActive = !vendorProfile.isDeleted;

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-30" />

      {/* Ambient background glow orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none z-10" />

      {/* Store Header Banner */}
      <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-[#120824] border-b border-white/10">
        {vendorProfile.banner ? (
          <img
            src={vendorProfile.banner}
            alt={`${vendorDisplayName} Banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-950 via-purple-950 to-[#170d2f] flex items-center justify-center">
            <div className="flex items-center gap-2 text-white/20 font-black tracking-widest text-lg sm:text-2xl uppercase">
              <Store className="w-6 h-6" />
              <span>Amarzone Certified Merchant</span>
            </div>
          </div>
        )}
        {/* Banner Gradient Mask overlay transitioning seamlessly into card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#170d2f] via-[#170d2f]/60 to-transparent" />
      </div>

      <div className="card-body relative z-20 flex-col md:flex-row items-center md:items-end justify-between gap-6 p-6 sm:p-8 -mt-16 sm:-mt-20">
        {/* Profile Logo and Store Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
          {/* Logo Container */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/40 bg-[#120824] shadow-2xl flex items-center justify-center ring-4 ring-[#170d2f]">
              {vendorProfile.logo ? (
                <img
                  src={vendorProfile.logo}
                  alt={vendorDisplayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-purple-900/30 to-[#120824] text-amber-400 flex items-center justify-center text-3xl sm:text-4xl font-black">
                  {vendorFirstLetter}
                </div>
              )}
            </div>

            {/* Online / Active Badge Indicator */}
            {isStoreAccountActive && (
              <span
                title="Active Storefront"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#170d2f] shadow flex items-center justify-center"
              >
                <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Identity & Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="badge badge-warning gap-1 px-3 py-2 text-xs font-black shadow text-slate-950">
                <Sparkles className="w-3.5 h-3.5" />
                Merchant Storefront
              </span>

              {isStoreAccountActive ? (
                <span className="badge badge-success badge-outline gap-1 font-bold text-xs bg-success/10 border-success/30 text-success">
                  <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                  Active Merchant
                </span>
              ) : (
                <span className="badge badge-error badge-outline gap-1 font-bold text-xs bg-error/10 border-error/30 text-error">
                  Store Suspended
                </span>
              )}

              <span className="badge badge-info badge-outline gap-1 font-bold text-xs bg-info/10 border-info/30 text-info">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Vendor
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {vendorDisplayName}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Manage store branding, dispatch operations, business address, and merchant security.
            </p>

            {/* Meta Tags: Vendor ID and Partner Date */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400">
              <button
                type="button"
                onClick={handleCopyVendorId}
                title="Click to copy Vendor ID"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <Store className="w-3 h-3 text-amber-400" />
                <span className="font-mono">ID: {vendorIdString.slice(0, 8)}...</span>
                {hasCopiedVendorId ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Partner since {formattedPartnerDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <button
            type="button"
            onClick={onRefreshProfile}
            disabled={isRefreshingProfile}
            className="btn btn-outline btn-sm gap-2 font-bold border-white/20 text-slate-200 hover:bg-white/10 hover:border-white/30 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-amber-400 ${
                isRefreshingProfile ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={onOpenEditModal}
            className="btn btn-sm gap-2 font-black shadow-lg shadow-amber-500/20 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 transition-all rounded-xl"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Store Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileHeader;
