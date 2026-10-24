"use client";

import React from "react";
import {
  Lightbulb,
  Truck,
  MessageSquare,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const HealthActionTips: React.FC = () => {
  const tips = [
    {
      icon: <Truck className="w-5 h-5 text-sky-400" />,
      title: "Ship within 24–48 Hours",
      desc: "Confirm shipment and upload carrier tracking codes as soon as labels are generated to safeguard your Late Shipment Rate.",
      actionLabel: "View Orders",
      href: "/vendor/orders",
    },
    {
      icon: <PackageCheck className="w-5 h-5 text-emerald-400" />,
      title: "Synchronize Real Stock Quantities",
      desc: "Regularly audit physical warehouse levels. Avoid seller cancellations by marking out-of-stock items before customers purchase.",
      actionLabel: "Manage Inventory",
      href: "/vendor/inventory",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      title: "Respond Promptly to Inquiries",
      desc: "Address customer messages within 24 hours to reduce dispute filings, refund chargebacks, and 1-star service reviews.",
      actionLabel: "Support Tickets",
      href: "/vendor",
    },
  ];

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-20" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              SLA Protection Best Practices
            </h3>
            <p className="text-xs text-slate-400">
              Operational habits that protect your account score and maintain top Buy Box ranking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-black/30 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-white/5 w-fit border border-white/10">
                  {tip.icon}
                </div>
                <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tip.desc}
                </p>
              </div>

              <Link
                href={tip.href}
                className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors group self-start pt-2"
              >
                <span>{tip.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthActionTips;
