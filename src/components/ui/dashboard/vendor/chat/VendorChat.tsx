"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { ChatLayout } from "@/components/ui/chat/ChatLayout";
import AZBread from "@/components/shared/AZBread";
import AZHeader from "@/components/shared/AZHeader";
import { useSocket } from "@/lib/socket";

const VendorChat = () => {
  const user = useAppSelector(selectCurrentUser);
  const { isConnected } = useSocket();

  return (
    <div className="space-y-4 w-full pb-6 text-slate-100">
      {/* 1. Breadcrumb Navigation */}
      <AZBread
        title="Buyer & Support Messages"
        parentHref="/vendor"
        parentLabel="Vendor Portal"
        icon={<MessageSquare className="w-3.5 h-3.5 text-amber-400" />}
        hoverColor="hover:text-amber-400"
      />

      {/* 2. Standardized Merchant Dashboard Header */}
      <AZHeader
        badgeLabel="Store Communications"
        badgeIcon={<MessageSquare className="w-3.5 h-3.5" />}
        statusLabel={isConnected ? "Real-time Live: Online" : "Real-time: Syncing..."}
        title="Customer Inquiries &"
        highlightTitle="Vendor Chat Hub"
        description="Engage directly with buyers regarding product questions, order fulfillment details, and platform support."
        actions={
          <Link
            href="/vendor/orders"
            className="btn btn-ghost btn-sm gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Store Orders</span>
          </Link>
        }
      />

      {/* 3. Real-Time Chat Layout configured for Vendor role */}
      <Suspense
        fallback={
          <div className="p-8 text-center">
            <span className="loading loading-spinner text-primary" />
          </div>
        }
      >
        <ChatLayout mode={user?.role || "VENDOR"} />
      </Suspense>
    </div>
  );
};

export default VendorChat;

