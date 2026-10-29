"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Shield } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { ChatLayout } from "@/components/ui/chat/ChatLayout";
import AZBread from "@/components/shared/AZBread";
import AZHeader from "@/components/shared/AZHeader";
import { useSocket } from "@/lib/socket";

const AdminChat = () => {
  const user = useAppSelector(selectCurrentUser);
  const { isConnected } = useSocket();

  return (
    <div className="space-y-4 w-full pb-6 text-slate-100">
      {/* 1. Breadcrumb Navigation */}
      <AZBread
        title="Support & Escalations Chat"
        parentHref="/admin"
        parentLabel="Admin Portal"
        icon={<MessageSquare className="w-3.5 h-3.5 text-secondary" />}
        hoverColor="hover:text-secondary"
      />

      {/* 2. Standardized Admin Governance Header */}
      <AZHeader
        badgeLabel="Support Communications"
        badgeIcon={<Shield className="w-3.5 h-3.5" />}
        statusLabel={isConnected ? "Real-time Live: Online" : "Real-time: Syncing..."}
        title="Support Helpdesk &"
        highlightTitle="Admin Messaging Hub"
        description="Oversee real-time customer support inquiries, merchant communications, escalated disputes, and platform-wide messages."
        actions={
          <Link
            href="/admin/dispute"
            className="btn btn-ghost btn-sm gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-secondary" />
            <span>Disputes Hub</span>
          </Link>
        }
      />

      {/* 3. Real-Time Chat Layout configured for Admin / Super Admin */}
      <Suspense
        fallback={
          <div className="p-8 text-center">
            <span className="loading loading-spinner text-primary" />
          </div>
        }
      >
        <ChatLayout mode={user?.role || "ADMIN"} />
      </Suspense>
    </div>
  );
};

export default AdminChat;

