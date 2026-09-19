import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Shield } from "lucide-react";
import { ChatLayout } from "@/src/components/ui/chat/ChatLayout";

export const metadata: Metadata = {
  title: "Support Chat & Disputes | Amarzone Admin",
  description: "Administrative communication hub for customer and vendor support.",
};

export default function AdminChatPage() {
  return (
    <div className="space-y-4 w-full pb-6 text-slate-100">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#0b1320] border border-sky-500/20 rounded-2xl p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="badge badge-info badge-sm font-semibold text-slate-950">
                Support Desk
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Support & Dispute Messages
            </h1>
            <p className="text-xs text-slate-300">
              Direct real-time channel to resolve inquiries and mediate store disputes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="btn btn-outline btn-sm border-white/20 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Real-Time Chat Layout */}
      <ChatLayout />
    </div>
  );
}
