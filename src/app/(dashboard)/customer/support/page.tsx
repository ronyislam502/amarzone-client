import { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft, Headphones, MessageSquare } from "lucide-react";
import { ChatLayout } from "@/src/components/ui/chat/ChatLayout";

export const metadata: Metadata = {
  title: "Customer Support | Amarzone Help Center",
  description: "Official 24/7 customer support for orders, payments, refunds, and account help.",
};

export default function CustomerSupportPage() {
  return (
    <div className="space-y-4 w-full pb-6 text-slate-100">
      {/* Support Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0e1726] via-[#162238] to-[#0c1322] border border-sky-500/20 rounded-2xl p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="badge badge-info badge-sm font-semibold text-slate-950">
                Amarzone Support Desk
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Platform Support & Inquiries
            </h1>
            <p className="text-xs text-slate-300">
              Direct help with account problems, payment issues, delivery status, and refunds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/customer"
              className="btn btn-outline btn-sm border-white/20 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Customer Hub
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Help Topics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
          <div className="font-bold text-sky-400 flex items-center gap-1.5 mb-0.5">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 Assistance</span>
          </div>
          <p className="text-[11px] text-slate-400">Official help from platform representatives</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-0.5">
            <span>💳 Payment & Refunds</span>
          </div>
          <p className="text-[11px] text-slate-400">Queries about charges and payouts</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
          <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-0.5">
            <span>🚚 Shipping & Tracking</span>
          </div>
          <p className="text-[11px] text-slate-400">Delay escalations and lost parcels</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
          <div className="font-bold text-purple-400 flex items-center gap-1.5 mb-0.5">
            <span>🛡️ Dispute Mediation</span>
          </div>
          <p className="text-[11px] text-slate-400">Order disagreements mediation</p>
        </div>
      </div>

      {/* Dedicated Support Chat with mode="support" */}
      <ChatLayout mode="support" />
    </div>
  );
}
