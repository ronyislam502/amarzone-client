import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Store } from "lucide-react";
import { ChatLayout } from "@/src/components/ui/chat/ChatLayout";

export const metadata: Metadata = {
  title: "Customer Inquiries & Messages | Amarzone Vendor",
  description: "Real-time communication with customers and support.",
};

export default function VendorChatPage() {
  return (
    <div className="space-y-4 w-full pb-6 text-slate-100">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1b1509] via-[#241a08] to-[#140f06] border border-amber-500/20 rounded-2xl p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Store className="w-4 h-4" />
              </div>
              <span className="badge badge-warning badge-sm font-semibold text-slate-950">
                Store Communication
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Customer Messages & Support
            </h1>
            <p className="text-xs text-slate-300">
              Respond promptly to customer questions regarding orders, products, and support.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/vendor"
              className="btn btn-outline btn-sm border-white/20 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Vendor Hub
            </Link>
          </div>
        </div>
      </div>

      {/* Real-Time Chat Layout */}
      <ChatLayout />
    </div>
  );
}
