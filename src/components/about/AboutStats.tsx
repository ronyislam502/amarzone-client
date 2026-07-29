import React from "react";
import { Users, PackageCheck, Building2, Globe, TrendingUp, Award } from "lucide-react";

const stats = [
  {
    id: "shoppers",
    label: "Active Shoppers",
    value: "2,000,000+",
    description: "Loyal customers shopping monthly across all categories",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50 dark:bg-blue-950/40",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "products",
    label: "Curated Products",
    value: "500,000+",
    description: "Quality items across electronics, fashion, home & lifestyle",
    icon: PackageCheck,
    color: "from-indigo-500 to-purple-600",
    lightBg: "bg-indigo-50 dark:bg-indigo-950/40",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "merchants",
    label: "Verified Merchants",
    value: "50,000+",
    description: "Empowered small businesses and global brand partners",
    icon: Building2,
    color: "from-purple-500 to-pink-600",
    lightBg: "bg-purple-50 dark:bg-purple-950/40",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "deliveries",
    label: "Global Destinations",
    value: "120+ Cities",
    description: "Ultra-fast fulfillment network delivering smiles nationwide & beyond",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function AboutStats() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            Platform Impact
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Amarzone in Numbers
          </p>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Empowering consumers and merchants with technology-driven marketplace solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${item.lightBg} ${item.textColor} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    Verified
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                  {item.value}
                </div>

                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {item.label}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Subtle hover gradient bottom border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
