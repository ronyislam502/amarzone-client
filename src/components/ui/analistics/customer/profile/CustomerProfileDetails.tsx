"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Package,
  Wallet,
  Heart,
  HelpCircle,
  ExternalLink,
  Lock,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { TCustomer } from "@/src/types/customer";

interface CustomerProfileDetailsProps {
  customerProfile: TCustomer;
  onOpenEditModal: () => void;
}

const CustomerProfileDetails = ({
  customerProfile,
  onOpenEditModal,
}: CustomerProfileDetailsProps) => {
  const formattedCreationDate = customerProfile.createdAt
    ? new Date(customerProfile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Verified Registration";

  const formattedUpdateDate = customerProfile.updatedAt
    ? new Date(customerProfile.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recent";

  const addressStreet = customerProfile.address?.street || "No street address configured";
  const addressState = customerProfile.address?.state || "";
  const addressPostalCode = customerProfile.address?.postalCode || "";
  const addressCountry = customerProfile.address?.country || "Country unassigned";

  const formattedCityStateZip = [addressState, addressPostalCode]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (2 cols): Comprehensive Profile Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Section 1: Personal & Contact Information Card */}
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
                    Identity
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Personal & Contact Profile
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Primary contact channels and shopper account details.
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
              {/* Full Name */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Legal Name</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white truncate">
                  {customerProfile.name || "Customer Name"}
                </div>
                <div className="text-[11px] text-slate-400">
                  Registered shopper display name
                </div>
              </div>

              {/* Email Address */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Email Address
                  </span>
                  <span className="badge badge-success badge-xs font-bold text-[10px]">
                    Verified
                  </span>
                </div>
                <a
                  href={`mailto:${customerProfile.email}`}
                  className="text-sm sm:text-base font-bold text-amber-400 hover:underline truncate block"
                  title={customerProfile.email}
                >
                  {customerProfile.email || "No email available"}
                </a>
                <div className="text-[11px] text-slate-400">
                  Used for order receipts and notifications
                </div>
              </div>

              {/* Telephone */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phone Number</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-200">
                  {customerProfile.phone ? (
                    <a
                      href={`tel:${customerProfile.phone}`}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {customerProfile.phone}
                    </a>
                  ) : (
                    <span className="text-slate-500 font-normal italic">
                      No telephone provided
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Delivery and dispatch updates via SMS
                </div>
              </div>

              {/* Account Role & Clearance */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Customer Role & Privileges</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-indigo-300">
                    Retail Customer
                  </span>
                  <span className="badge badge-info badge-sm font-bold text-[10px]">
                    Consumer
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Full access to shopping, reviews & customer portal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Default Shipping & Delivery Address Card */}
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
                    Fulfillment
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Default Delivery Address
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Where your purchases and packages will be shipped.
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
                      Primary Shipping Destination
                    </span>
                    <span className="badge badge-success badge-xs font-bold">
                      Default
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

        {/* Section 3: Account Governance & Audit Trail */}
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
                Account Audit & Timeline
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Account Registered</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">
                  {formattedCreationDate}
                </div>
                <div className="text-[10px] text-slate-500">
                  Initial registration timestamp
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
                  Most recent account modification
                </div>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  <span>System Standing</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Active & In Good Standing</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Compliant with terms of service
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
                Shopper Hub
              </span>
              <h3 className="text-base font-black text-white">
                Quick Shortcuts
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* My Orders */}
              <Link
                href="/customer/orders"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-amber-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      My Orders
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Track packages & history
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Amarzone Wallet */}
              <Link
                href="/customer/wallet"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-emerald-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Amarzone Wallet
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Balance & refunds
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Wishlist & Saved */}
              <Link
                href="/customer/wishlist"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-rose-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                      Wishlist & Saved
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Saved products for later
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Customer Support */}
              <Link
                href="/customer/support"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-indigo-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Help & Support
                    </div>
                    <div className="text-[10px] text-slate-400">
                      24/7 dedicated assistance
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-all" />
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
                  Credential Security
                </h4>
                <div className="text-[10px] text-slate-400">
                  Encrypted Protection
                </div>
              </div>
            </div>

            <div className="card bg-[#120824] border border-white/10 p-3.5 rounded-xl space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                Your authentication credentials and password hashes are strictly safeguarded with bcrypt rounds and never displayed in client views.
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

export default CustomerProfileDetails;
