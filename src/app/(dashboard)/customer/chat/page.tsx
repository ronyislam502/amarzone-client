import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, ArrowLeft, ShieldCheck } from "lucide-react";
import { ChatLayout } from "@/src/components/ui/chat/ChatLayout";

export const metadata: Metadata = {
  title: "Vendor Messages | Amarzone Customer",
  description: "Real-time communication with vendors regarding your orders and items.",
};

export default function CustomerChatPage() {
  return (
    <div className="space-y-4 w-full pb-6 text-slate-100">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#170d2f] via-[#1c123b] to-[#120a26] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="badge badge-primary badge-sm font-semibold text-primary-content">
                Vendor Messaging
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Order & Vendor Messages
            </h1>
            <p className="text-xs text-slate-300">
              Chat in real-time with store vendors about your orders and purchases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/customer/orders"
              className="btn btn-outline btn-sm border-white/20 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              My Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Real-Time Chat Layout with mode="vendor" */}
      <ChatLayout mode="vendor" />
    </div>
  );
}
