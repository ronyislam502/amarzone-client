"use client";

import { Suspense } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { ChatLayout } from "@/components/ui/chat/ChatLayout";
import AZBread from "@/components/shared/AZBread";
import AZHeader from "@/components/shared/AZHeader";
import { useSocket } from "@/lib/socket";

const CustomerChat = () => {
    const user = useAppSelector(selectCurrentUser);
    const { isConnected } = useSocket();

    return (
        <div className="space-y-4 w-full pb-6 text-slate-100">
            {/* 1. Breadcrumb Navigation */}
            <AZBread
                title="Messages & Conversations"
                parentHref="/customer"
                parentLabel="Customer Portal"
                icon={<MessageSquare className="w-3.5 h-3.5 text-amber-400" />}
                hoverColor="hover:text-amber-400"
            />

            {/* 2. Standardized Page Header */}
            <AZHeader
                badgeLabel="Messages Hub"
                badgeIcon={<MessageSquare className="w-3.5 h-3.5" />}
                statusLabel={isConnected ? "Real-time Live: Online" : "Real-time: Connecting..."}
                title="Messages &"
                highlightTitle="Conversations"
                description="Chat in real-time with store vendors and Amarzone customer support representatives."
                actions={
                    <Link
                        href="/customer/orders"
                        className="btn btn-ghost btn-sm gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer rounded-xl"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                        <span>My Orders</span>
                    </Link>
                }
            />

            {/* 3. Real-Time Chat Layout with dynamic role mode */}
            <Suspense
                fallback={
                    <div className="p-8 text-center">
                        <span className="loading loading-spinner text-primary" />
                    </div>
                }
            >
                <ChatLayout mode={user?.role} />
            </Suspense>
        </div>
    );
};

export default CustomerChat;
