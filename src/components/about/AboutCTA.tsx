import React from "react";
import Link from "next/link";
import { ArrowRight, Store, ShoppingBag } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Ready to Experience the{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Future of Shopping?
            </span>
          </h2>

          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join millions of satisfied buyers or unleash your business potential as a verified merchant on Amarzone today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Start Shopping Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-base transition-all duration-200"
            >
              <Store className="w-5 h-5 text-amber-400" />
              <span>Become a Seller</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
