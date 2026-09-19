"use client";

import React, { useState } from "react";
import { TConversation, TParticipant } from "@/src/types/chat";
import { Search, Plus, MessageSquare, Shield, Store, User as UserIcon, Package } from "lucide-react";

interface ConversationListProps {
  conversations: TConversation[];
  activeConversationId: string | null;
  currentUserId: string;
  onSelectConversation: (conversation: TConversation) => void;
  onStartNew?: () => void;
  isLoading?: boolean;
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
  onSelectConversation,
  onStartNew,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Simple client-side search filtering on loaded conversations
  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    const otherParticipant = conv.participants?.find((p) => {
      const pId = typeof p === "string" ? p : p?._id;
      return pId && pId.toString() !== currentUserId?.toString();
    });

    const name = otherParticipant?.name?.toLowerCase() || "";
    const email = otherParticipant?.email?.toLowerCase() || "";
    const type = conv.conversationType?.toLowerCase() || "";

    return name.includes(term) || email.includes(term) || type.includes(term);
  });

  return (
    <div className="flex flex-col h-full bg-base-100/60 backdrop-blur-sm rounded-2xl border border-base-content/10 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-base-content/10 flex items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="text-base font-bold text-base-content flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Messages
          </h2>
          <p className="text-[11px] text-base-content/50">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {onStartNew && (
          <button
            onClick={onStartNew}
            className="btn btn-primary btn-sm btn-circle shadow-sm shadow-primary/20"
            title="Start new conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-base-content/5 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="input input-sm input-bordered w-full pl-9 rounded-xl bg-base-200/50 border-base-content/10 text-xs focus:border-primary focus:outline-none placeholder:text-base-content/40"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-base-content/5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 gap-2 text-base-content/50">
            <span className="loading loading-spinner loading-sm text-primary" />
            <span className="text-xs">Loading chats...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-base-content/50 text-xs">
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
          filteredConversations.map((conv) => {
            const isActive = conv._id === activeConversationId;
            const otherParticipant: TParticipant | undefined =
              conv.participants?.find((p) => {
                const pId = typeof p === "string" ? p : p?._id;
                return pId && pId.toString() !== currentUserId?.toString();
              }) || conv.participants?.[0];

            const name = otherParticipant?.name || "Participant";
            const role = (otherParticipant?.role || "USER").toUpperCase();
            const avatar = otherParticipant?.avatar;

            // Last message preview
            const lastMessageText =
              conv.lastMessageType === "IMAGE"
                ? "📷 Image"
                : conv.lastMessageType === "FILE"
                ? "📎 Attachment"
                : (conv.lastMessage as any)?.message ||
                  (conv as any).lastMessagePreview ||
                  "Started a conversation";

            const unread = conv.unreadCount || 0;

            return (
              <button
                key={conv._id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full p-3 flex items-start gap-3 text-left transition-colors duration-150 hover:bg-base-200/60 ${
                  isActive ? "bg-primary/10 border-r-2 border-primary" : ""
                }`}
              >
                {/* Avatar */}
                <div className="avatar shrink-0 mt-0.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${
                      isActive
                        ? "bg-primary text-primary-content border-primary"
                        : "bg-base-200 text-base-content/70 border-base-content/10"
                    }`}
                  >
                    {avatar ? (
                      <img src={avatar} alt={name} />
                    ) : (
                      name[0]?.toUpperCase()
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive ? "text-primary" : "text-base-content"
                      }`}
                    >
                      {name}
                    </span>
                    <span className="text-[10px] text-base-content/40 shrink-0">
                      {formatRelativeTime(conv.lastMessageAt || conv.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`badge badge-xs text-[9px] px-1.5 py-0.5 font-medium ${
                        role === "ADMIN" || role === "SUPER_ADMIN"
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
          })
        )}
      </div>
    </div>
  );
};
