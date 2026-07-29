import React from "react";
import { Target, Eye, CheckCircle2, Compass, Sparkles } from "lucide-react";

export default function AboutMissionVision() {
  return (
    <section id="our-story" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Purpose</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Driven by Purpose, Powered by Excellence
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            We are building the future of commerce by prioritizing transparency, seller empowerment, and relentless customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="relative group p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <Target className="w-48 h-48 text-indigo-400" />
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-6 backdrop-blur-md">
                <Target className="w-7 h-7" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white">
                Our Mission
              </h3>

              <p className="text-indigo-100/90 text-base leading-relaxed mb-8">
                To democratize e-commerce by providing every shopper with access to high-quality, authentic products at competitive prices, backed by ultra-responsive customer service and seamless, secure checkout experiences.
              </p>

              <div className="space-y-3.5">
                {[
                  "Fostering trust with 100% verified merchant credentials",
                  "Delivering friction-free logistics with transparent order tracking",
                  "Empowering local businesses with scalable digital storefront tools",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-indigo-100">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="relative group p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 text-white shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <Eye className="w-48 h-48 text-purple-400" />
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 mb-6 backdrop-blur-md">
                <Eye className="w-7 h-7" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white">
                Our Vision
              </h3>

              <p className="text-purple-100/90 text-base leading-relaxed mb-8">
                To become the most trusted, inclusive, and technologically advanced online marketplace worldwide—where buying is effortless, selling is empowering, and sustainability guides every milestone.
              </p>

              <div className="space-y-3.5">
                {[
                  "Pioneering AI-curated personalized shopping recommendations",
                  "Achieving zero-carbon eco-friendly packaging and fulfillment",
                  "Connecting global markets through seamless cross-border logistics",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-purple-100">
                    <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
