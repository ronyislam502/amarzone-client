import React from "react";
import { Calendar, Rocket, Award, Globe, Sparkles, ShieldCheck } from "lucide-react";

const timelineEvents = [
  {
    year: "2021",
    title: "Amarzone Launched",
    description:
      "Founded with a mission to create a clean, trustworthy marketplace connecting local merchants with online shoppers.",
    icon: Rocket,
    tag: "Inception",
  },
  {
    year: "2023",
    title: "Nationwide Logistics Network",
    description:
      "Integrated smart dispatch hubs and partnered with express courier services for guaranteed 24-48 hour delivery.",
    icon: ShieldCheck,
    tag: "Infrastructure",
  },
  {
    year: "2024",
    title: "AI Search & Merchant Suite",
    description:
      "Rolled out machine learning product search and zero-code vendor analytics dashboards for sellers.",
    icon: Sparkles,
    tag: "Innovation",
  },
  {
    year: "2025",
    title: "2 Million Active Shoppers",
    description:
      "Crossed major growth milestones with 50,000+ verified merchants and over 500,000 listed products.",
    icon: Award,
    tag: "Milestone",
  },
  {
    year: "2026",
    title: "Eco-Shipping & Global Reach",
    description:
      "Pioneered 100% recyclable packaging initiatives and introduced cross-border order fulfillment.",
    icon: Globe,
    tag: "Present",
  },
];

export default function AboutTimeline() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Our Journey</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Milestones Along the Way
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            From humble beginnings to an industry leader, here is how Amarzone evolved into the platform it is today.
          </p>
        </div>

        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-32 space-y-12">
          {timelineEvents.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative pl-8 group">
                {/* Year tag for larger screens */}
                <div className="hidden sm:block absolute -left-32 top-1 text-right w-24">
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {item.year}
                  </span>
                </div>

                {/* Timeline Dot Icon */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-950 group-hover:scale-125 transition-transform duration-300">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content Box */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="sm:hidden text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {item.year}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
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
