import React from "react";
import { ShieldCheck, RefreshCw, Headphones, Lock } from "lucide-react";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Guarantee",
    desc: "Every product is sourced directly from brand owners or verified distributor partners.",
  },
  {
    icon: RefreshCw,
    title: "30-Day Hassle-Free Returns",
    desc: "If you're not completely satisfied, return items easily with instant refund options.",
  },
  {
    icon: Headphones,
    title: "24/7 Priority Support",
    desc: "Dedicated customer happiness team available round the clock via chat & email.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Encryption",
    desc: "Fully PCI-DSS compliant secure payment gateway protecting your financial details.",
  },
];

export default function AboutGuarantees() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
