"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Star,
  Package,
  Clock,
  MapPin,
  Share2,
  Heart,
  Store,
  CheckCircle2,
  Mail,
  Phone,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { TVendor } from "@/types/vendor";
import { toast } from "react-toastify";

interface VendorHeaderProps {
  vendor: TVendor | null | undefined;
  totalProducts?: number;
  totalReviews?: number;
  averageRating?: number | string;
  positivePercentage?: number;
  onContactClick?: () => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  vendor,
  totalProducts = 0,
  totalReviews = 0,
  averageRating = 4.8,
  positivePercentage = 98,
  onContactClick,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const vendorName = vendor?.name || "Amarzone Verified Merchant";
  const logo = vendor?.logo;
  const banner = vendor?.banner;
  const address = vendor?.address;

  const locationString = address
    ? [(address as any)?.city || address?.state, address?.country].filter(Boolean).join(", ")
    : "Verified Hub";

  const memberSinceYear = vendor?.createdAt
    ? new Date(vendor.createdAt).getFullYear()
    : 2024;

  const initials = vendorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Store link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 1800,
      });
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast.info(
      !isFollowing
        ? `You are now following ${vendorName}!`
        : `Unfollowed ${vendorName}`,
      {
        position: "bottom-right",
        autoClose: 1600,
      }
    );
  };

  const FALLBACK_BANNER =
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400";
  const FALLBACK_LOGO =
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400";

  const [bannerSrc, setBannerSrc] = useState<string>(banner || FALLBACK_BANNER);
  const [logoSrc, setLogoSrc] = useState<string>(logo || FALLBACK_LOGO);

  // Sync state if vendor changes
  React.useEffect(() => {
    setBannerSrc(banner || FALLBACK_BANNER);
  }, [banner]);

  React.useEffect(() => {
    setLogoSrc(logo || FALLBACK_LOGO);
  }, [logo]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm select-none">
      {/* 1. HERO BANNER */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
        <img
          src={bannerSrc}
          alt={`${vendorName} Banner`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="eager"
          onError={() => {
            if (bannerSrc !== FALLBACK_BANNER) {
              setBannerSrc(FALLBACK_BANNER);
            }
          }}
        />

        {/* Ambient Gradient Shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

        {/* Floating Quick Badges on Banner */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/15 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Merchant</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Top Rated</span>
          </span>
        </div>

        {/* Floating Actions on Banner */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-95"
            title="Share Storefront"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. PROFILE DETAILS BAR */}
      <div className="px-5 sm:px-8 pb-6 pt-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
          {/* Logo & Store Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Store Logo with Border Ring */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl bg-white p-1.5 shadow-2xl border-2 border-white shrink-0 overflow-hidden ring-4 ring-black/5">
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-indigo-100 flex items-center justify-center">
                <img
                  src={logoSrc}
                  alt={vendorName}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="eager"
                  onError={() => {
                    if (logoSrc !== FALLBACK_LOGO) {
                      setLogoSrc(FALLBACK_LOGO);
                    }
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
              </div>
            </div>

            {/* Title & Micro Meta */}
            <div className="space-y-1.5 pb-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {vendorName}
                </h1>
                <span className="badge badge-warning font-black text-xs text-slate-950 px-2 py-0.5">
                  Pro Seller
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {locationString}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Member since {memberSinceYear}
                </span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-center sm:justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleFollowToggle}
              className={`py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
                isFollowing
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFollowing ? "fill-rose-500 text-rose-500" : "text-white"
                }`}
              />
              <span>{isFollowing ? "Following" : "Follow Store"}</span>
            </button>

            {onContactClick ? (
              <button
                type="button"
                onClick={onContactClick}
                className="py-2.5 px-5 rounded-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-xs border border-amber-500/30"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Seller</span>
              </button>
            ) : vendor?.email ? (
              <a
                href={`mailto:${vendor.email}?subject=Inquiry about ${encodeURIComponent(
                  vendorName
                )} products`}
                className="py-2.5 px-5 rounded-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-xs border border-amber-500/30"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Seller</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* 3. PERFORMANCE STATS PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
          {/* Rating */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {typeof averageRating === "number"
                    ? averageRating.toFixed(1)
                    : averageRating}
                </span>
                <span className="text-[11px] text-slate-400">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalReviews} Customer Reviews
              </p>
            </div>
          </div>

          {/* Positive Feedback */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {positivePercentage}%
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Positive Feedback</p>
            </div>
          </div>

          {/* Products in Store */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {totalProducts}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Products in Store</p>
            </div>
          </div>

          {/* Shipping Speed */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                &lt; 24h
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Dispatch Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;
