"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { Search, Plus, MessageSquare, Shield, Store, User as UserIcon, Package } from "lucide-react";
import { TConversation, TParticipant } from "@/types/chat";
import NotificationListSkeleton from "@/components/shared/skeleton/NotificationListSkeleton";

export type TFilterTab = {
  key: string;
  label: string;
  count?: number;
};

interface ConversationListProps {
  conversations: TConversation[];
  activeConversationId: string | null;
  currentUserId: string;
  currentUserEmail?: string;
  onSelectConversation: (conversation: TConversation) => void;
  onStartNew?: () => void;
  isLoading?: boolean;
  filterTabs?: TFilterTab[];
  activeFilterTab?: string;
  onFilterTabChange?: (tabKey: string) => void;
}

function formatRelativeTime(dateString?: string | Date) {
  if (!dateString) return "";
  try {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  currentUserId,
  currentUserEmail,
  onSelectConversation,
  onStartNew,
  isLoading = false,
  filterTabs,
  activeFilterTab,
  onFilterTabChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Simple client-side search filtering on loaded conversations
  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    const myEmail = currentUserEmail?.toLowerCase();
    const otherParticipant = conv.participants?.find((p) => {
      if (!p) return false;
      const pId = typeof p === "string" ? p : p?._id;
      const pEmail = typeof p === "object" ? p?.email?.toLowerCase() : null;
      if (currentUserId && pId && pId.toString() === currentUserId.toString()) return false;
      if (myEmail && pEmail && pEmail === myEmail) return false;
      return true;
    }) || conv.participants?.[0];

    const name = otherParticipant?.name?.toLowerCase() || "";
    const email = otherParticipant?.email?.toLowerCase() || "";
    const type = conv.conversationType?.toLowerCase() || "";

    return name.includes(term) || email.includes(term) || type.includes(term);
  });

  return (
    <div className="flex flex-col h-full bg-[#120824]/90 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 pb-3 bg-[#170d2f]/95 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            Messages
          </h2>
          <p className="text-[11px] text-slate-400">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {onStartNew && (
          <button
            onClick={onStartNew}
            className="btn btn-primary btn-sm btn-circle shadow-sm shadow-primary/20 cursor-pointer"
            title="Start new conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-[#170d2f]/60 border-b border-white/10 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="input input-sm input-bordered w-full pl-9 rounded-xl bg-[#120824] border-white/15 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Dynamic Filter Pills */}
      {filterTabs && filterTabs.length > 1 && (
        <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/10 shrink-0 bg-[#120824]/60">
          {filterTabs.map((tab) => {
            const isActive = activeFilterTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onFilterTabChange?.(tab.key)}
                className={`btn btn-xs rounded-lg px-2.5 font-medium transition-all ${isActive
                  ? "btn-primary text-primary-content shadow-xs"
                  : "btn-ghost text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] ml-1 px-1 rounded-full ${isActive
                      ? "bg-white/25 text-white"
                      : "bg-white/10 text-slate-300"
                      }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {isLoading ? (
          <NotificationListSkeleton count={5} />
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            {searchTerm ? (
              <p>No conversations match &ldquo;{searchTerm}&rdquo;</p>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <MessageSquare className="w-8 h-8 text-base-content/20" />
                <p>No active conversations yet.</p>
                {onStartNew && (
                  <button
                    onClick={onStartNew}
                    className="btn btn-primary btn-xs rounded-lg mt-1"
                  >
                    Start First Chat
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <Suspense fallback={<NotificationListSkeleton count={5} />}>
            {filteredConversations.map((conv) => {
            const isActive = conv._id === activeConversationId;
            const myEmail = currentUserEmail?.toLowerCase();
            const otherParticipant: TParticipant | undefined =
              conv.participants?.find((p) => {
                if (!p) return false;
                const pId = typeof p === "string" ? p : p?._id;
                const pEmail = typeof p === "object" ? p?.email?.toLowerCase() : null;
                if (currentUserId && pId && pId.toString() === currentUserId.toString()) return false;
                if (myEmail && pEmail && pEmail === myEmail) return false;
                return true;
              }) || conv.participants?.[0];

            const name = otherParticipant?.name || "Participant";
            const role = (otherParticipant?.role || "USER").toUpperCase();
            const isVendor = role === "VENDOR";
            // For Vendor: use logo (per TVendor interface). For Customer/Admin: use avatar (per TCustomer/TAdmin interfaces)
            const displayImage = isVendor
              ? (otherParticipant?.logo || otherParticipant?.avatar)
              : otherParticipant?.avatar;

            // Last message preview
            const lastMsgObj =
              typeof conv.lastMessage === "object" && conv.lastMessage !== null
                ? (conv.lastMessage as { message?: string })
                : null;
            const lastMessageText =
              conv.lastMessageType === "IMAGE"
                ? "📷 Image"
                : conv.lastMessageType === "FILE"
                  ? "📎 Attachment"
                  : lastMsgObj?.message ||
                  "Started a conversation";

            const unread = conv.unreadCount || 0;

            return (
              <button
                key={conv._id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full p-3 flex items-start gap-3 text-left transition-colors duration-150 hover:bg-white/5 cursor-pointer ${isActive ? "bg-primary/20 border-l-4 border-primary" : ""
                  }`}
              >
                {/* Avatar / Vendor Logo */}
                <div className="avatar shrink-0 mt-0.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border overflow-hidden relative shadow-sm ${isActive
                      ? "bg-primary text-primary-content border-primary"
                      : isVendor
                        ? "bg-amber-500/10 text-amber-400 border-amber-400/20"
                        : "bg-white/10 text-white border-white/10"
                      }`}
                  >
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt={name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : isVendor ? (
                      <Store className="w-5 h-5 text-amber-400" />
                    ) : role === "ADMIN" || role === "SUPER_ADMIN" ? (
                      <Shield className="w-5 h-5 text-primary" />
                    ) : (
                      name[0]?.toUpperCase()
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs font-semibold truncate ${isActive ? "text-amber-400 font-bold" : "text-white"
                        }`}
                    >
                      {name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatRelativeTime(conv?.lastMessageAt || conv.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`badge badge-xs text-[9px] px-1.5 py-0.5 font-medium ${role === "ADMIN" || role === "SUPER_ADMIN"
                        ? "badge-primary"
                        : role === "VENDOR"
                          ? "badge-warning"
                          : "badge-ghost"
                        }`}
                    >
                      {role === "ADMIN" || role === "SUPER_ADMIN" ? (
                        <span className="flex items-center gap-0.5">
                          <Shield className="w-2 h-2" /> Support
                        </span>
                      ) : role === "VENDOR" ? (
                        <span className="flex items-center gap-0.5">
                          <Store className="w-2 h-2" /> Vendor
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <UserIcon className="w-2 h-2" /> Customer
                        </span>
                      )}
                    </span>

                    {conv.conversationType === "ORDER" && (
                      <span className="badge badge-info badge-outline badge-xs text-[9px] gap-0.5 font-semibold">
                        <Package className="w-2 h-2" />
                        {conv.order
                          ? typeof conv.order === "object"
                            ? `#${conv.order.orderNo || conv.order._id?.slice(-6)}`
                            : `#${String(conv.order).slice(-6)}`
                          : "Order"}
                      </span>
                    )}

                    {conv.conversationType === "SUPPORT" && (
                      <span className="badge badge-primary badge-outline badge-xs text-[9px] gap-0.5 font-semibold">
                        <Shield className="w-2 h-2" />
                        Support Ticket
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-base-content/60 truncate">
                      {lastMessageText}
                    </p>

                    {unread > 0 && (
                      <span className="badge badge-primary badge-sm h-4 min-w-4 px-1 text-[10px] font-bold shrink-0">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          </Suspense>
        )}
      </div>
    </div>
  );
};
