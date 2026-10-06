"use client";

import React from "react";
import {
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
} from "lucide-react";
import { TVendor } from "@/types/vendor";

interface VendorAboutSectionProps {
  vendor: TVendor | null | undefined;
}

export const VendorAboutSection: React.FC<VendorAboutSectionProps> = ({ vendor }) => {
  const vendorName = vendor?.name || "Amarzone Verified Merchant";
  const address = vendor?.address;

  const fullAddress = address
    ? [
        (address as any)?.address || address.street,
        (address as any)?.city,
        address.state,
        address.postalCode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "Authorized Amarzone Marketplace Fulfillment Hub";

  const memberSince = vendor?.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "January 2024";

  return (
    <div className="space-y-6 select-none" id="about-vendor-section">
      {/* 1. STORE OVERVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              About {vendorName}
            </h3>
            <p className="text-xs text-slate-500">
              Authorized seller and partner on the Amarzone Marketplace
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
          Welcome to the official storefront of <strong className="text-slate-900">{vendorName}</strong>.
          We are committed to delivering authentic, premium quality products with industry-standard
          packaging and rapid dispatch. Every product in our catalog undergoes rigorous quality checks
          to ensure 100% customer satisfaction and compliance with Amarzone standards.
        </p>

        {/* TRUST BADGES ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Authentic</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Direct source verified inventory
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <Truck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fast Fulfillment</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Orders packed & shipped within 24-48h
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <RotateCcw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Easy 30-Day Returns</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Hassle-free replacement or refund
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <Lock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Secure Checkout</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Protected by Amarzone Buyer Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTACT & BUSINESS INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Address Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900">
              Business Location & Address
            </h4>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <p className="font-semibold text-slate-800">{vendorName}</p>
            <p>{fullAddress}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Store registered on Amarzone since {memberSince}</span>
          </div>
        </div>

        {/* Customer Support Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900">
              Customer Support & Contact
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            {vendor?.email ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Support Email
                  </span>
                  <a
                    href={`mailto:${vendor.email}`}
                    className="font-semibold text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    {vendor.email}
                  </a>
                </div>
              </div>
            ) : null}

            {vendor?.phone ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Phone / Helpline
                  </span>
                  <span className="font-semibold text-slate-900">
                    {vendor.phone}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Typical response time: under 2 hours during business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAboutSection;
