"use client";

import {
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Package,
  Layers,
  DollarSign,
  ShoppingCart,
  ExternalLink,
  Lock,
  Clock,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { TVendor } from "@/src/types/vendor";

interface VendorProfileDetailsProps {
  vendorProfile: TVendor;
  onOpenEditModal: () => void;
}

const VendorProfileDetails = ({
  vendorProfile,
  onOpenEditModal,
}: VendorProfileDetailsProps) => {
  const formattedRegistrationDate = vendorProfile.createdAt
    ? new Date(vendorProfile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Verified Registration";

  const formattedUpdateDate = vendorProfile.updatedAt
    ? new Date(vendorProfile.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recent";

  const addressStreet =
    vendorProfile.address?.street || "No street address configured";
  const addressState = vendorProfile.address?.state || "";
  const addressPostalCode = vendorProfile.address?.postalCode || "";
  const addressCountry =
    vendorProfile.address?.country || "Country unassigned";

  const formattedCityStateZip = [addressState, addressPostalCode]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (2 cols): Comprehensive Store Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Section 1: Store Identity & Merchant Information */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
          {/* Ambient background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-sm font-black text-slate-950">
                    Merchant Identity
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Store & Business Profile
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Official merchant identity, contact channels, and store clearance.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenEditModal}
                className="btn btn-outline btn-xs font-bold border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
              >
                Edit Information
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Store Name */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Store / Business Name</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white truncate">
                  {vendorProfile.name || "Merchant Store"}
                </div>
                <div className="text-[11px] text-slate-400">
                  Public storefront and catalog brand name
                </div>
              </div>

              {/* Official Email */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Merchant Email
                  </span>
                  <span className="badge badge-success badge-xs font-bold text-[10px]">
                    Verified
                  </span>
                </div>
                <a
                  href={`mailto:${vendorProfile.email}`}
                  className="text-sm sm:text-base font-bold text-amber-400 hover:underline truncate block"
                  title={vendorProfile.email}
                >
                  {vendorProfile.email || "No email available"}
                </a>
                <div className="text-[11px] text-slate-400">
                  Used for order alerts and settlement invoices
                </div>
              </div>

              {/* Phone / Hotline */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Business Phone / Hotline</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-200">
                  {vendorProfile.phone ? (
                    <a
                      href={`tel:${vendorProfile.phone}`}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {vendorProfile.phone}
                    </a>
                  ) : (
                    <span className="text-slate-500 font-normal italic">
                      No business phone configured
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Direct dispatch and courier coordination line
                </div>
              </div>

              {/* Role & Privileges */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Merchant Role & Clearance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-indigo-300">
                    Certified Vendor
                  </span>
                  <span className="badge badge-info badge-sm font-bold text-[10px]">
                    Marketplace Merchant
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Authorized to publish products, variants & manage orders
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Fulfillment Headquarters & Operations Address */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
          {/* Ambient background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-emerald-500/15 via-teal-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-success badge-sm font-black text-slate-950">
                    Operations
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Fulfillment Headquarters
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Warehouse dispatch base and registered business headquarters.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenEditModal}
                className="btn btn-outline btn-xs font-bold border-emerald-400/40 text-emerald-400 hover:bg-emerald-400 hover:text-slate-950 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
              >
                Change Address
              </button>
            </div>

            {/* Address Content Subcard */}
            <div className="card bg-[#120824] border border-white/10 p-5 rounded-2xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Primary Operating Hub
                    </span>
                    <span className="badge badge-success badge-xs font-bold">
                      Active Node
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {addressStreet}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300">
                    {formattedCityStateZip || "State and Postal Code not specified"}
                  </div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    {addressCountry}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase">Street</span>
                  <div className="font-bold text-slate-200 truncate">{addressStreet}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase">State / Province</span>
                  <div className="font-bold text-slate-200 truncate">
                    {addressState || "N/A"}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase">Postal Code</span>
                  <div className="font-bold text-slate-200 truncate">
                    {addressPostalCode || "N/A"}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase">Country</span>
                  <div className="font-bold text-emerald-400 truncate">
                    {addressCountry}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Store Branding Assets Preview */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
          {/* Ambient background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-purple-500/15 via-pink-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="badge badge-secondary badge-sm font-black text-slate-950">
                Media Assets
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Store Branding Assets
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Store Logo Card */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Store Logo
                  </span>
                  {vendorProfile.logo && (
                    <a
                      href={vendorProfile.logo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Full View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="h-28 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-2">
                  {vendorProfile.logo ? (
                    <img
                      src={vendorProfile.logo}
                      alt="Store Logo"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-slate-500 text-xs italic">
                      No custom logo uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* Store Banner Card */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    Store Banner
                  </span>
                  {vendorProfile.banner && (
                    <a
                      href={vendorProfile.banner}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>Full View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="h-28 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {vendorProfile.banner ? (
                    <img
                      src={vendorProfile.banner}
                      alt="Store Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-500 text-xs italic">
                      No custom banner uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Governance & Audit Trail */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none z-20" />
          {/* Ambient background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-indigo-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="badge badge-info badge-sm font-black text-slate-950">
                Governance
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Store Timeline & Audit Trail
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Store Onboarding</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">
                  {formattedRegistrationDate}
                </div>
                <div className="text-[10px] text-slate-500">
                  Marketplace onboarding date
                </div>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Last Profile Update</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">
                  {formattedUpdateDate}
                </div>
                <div className="text-[10px] text-slate-500">
                  Most recent profile modification
                </div>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  <span>Compliance Standing</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Active & In Good Standing</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Compliant with merchant policies
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (1 col): Navigation Shortcuts & Security Guarantee */}
      <div className="space-y-6">
        {/* Navigation Quick Actions Card */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="space-y-1 border-b border-white/10 pb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                Merchant Operations
              </span>
              <h3 className="text-base font-black text-white">
                Quick Shortcuts
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Products Management */}
              <Link
                href="/vendor/products"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-amber-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Catalog Products
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Manage product listings
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Orders & Fulfillment */}
              <Link
                href="/vendor/orders"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-emerald-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Orders & Shipments
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Fulfill buyer orders
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Inventory Management */}
              <Link
                href="/vendor/inventory"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-indigo-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Inventory & Stock
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Warehouse stock levels
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Earnings & Payouts */}
              <Link
                href="/vendor/payouts"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-emerald-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Earnings & Payouts
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Revenue statements
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Security and Privacy Assurance Card */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 space-y-4">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
                  Merchant Security
                </h4>
                <div className="text-[10px] text-slate-400">
                  Encrypted Credentials
                </div>
              </div>
            </div>

            <div className="card bg-[#120824] border border-white/10 p-3.5 rounded-xl space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                Your merchant credentials and passwords are hash-protected with high-cost salt factors and strictly withheld from client displays.
              </p>
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Exposure Password Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileDetails;
