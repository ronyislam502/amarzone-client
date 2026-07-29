import React from "react";
import { Heart, ShieldCheck, Zap, Lock, Globe, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Customer Obsession",
    description:
      "We start with the customer and work backwards. Every feature, policy, and design decision is crafted to maximize user joy and satisfaction.",
    accent: "text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    description:
      "We rigorously verify merchants and audit listings to ensure 100% genuine products, accurate specifications, and honest reviews.",
    accent: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900",
  },
  {
    icon: Zap,
    title: "Lightning Fulfillment",
    description:
      "Time matters. Our automated logistics hubs and smart routing ensure fast processing and real-time package status updates.",
    accent: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
  },
  {
    icon: Lock,
    title: "Total Security & Privacy",
    description:
      "Bank-grade 256-bit encryption protects every transaction. Your payment credentials and personal data are strictly safeguarded.",
    accent: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
  },
  {
    icon: Globe,
    title: "Sustainable Future",
    description:
      "Committed to reducing environmental impact through eco-conscious packaging, smart route optimization, and green merchant initiatives.",
    accent: "text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900",
  },
  {
    icon: Sparkles,
    title: "Relentless Innovation",
    description:
      "Leveraging cutting-edge web tech, AI recommendations, and smart search tools to continually upgrade how buyers discover great products.",
    accent: "text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900",
  },
];

export default function AboutValues() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            What Drives Us
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Our Core Principles
          </p>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            These guiding values define our culture, inspire our features, and shape every interaction on Amarzone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${val.accent} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.description}
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
