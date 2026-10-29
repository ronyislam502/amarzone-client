"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import {
  ArrowLeft,
  Archive,
  MoreVertical,
  Shield,
  Store,
  User as UserIcon,
  RefreshCw,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import { TConversation, TParticipant, TTypingEventPayload } from "@/types/chat";
import { useArchiveConversationMutation, useGetConversationMessagesQuery, useMarkMessagesAsReadMutation, useSendMessageMutation } from "@/redux/features/chat/chatApi";
import { getSocket, joinConversationRoom, leaveConversationRoom } from "@/lib/socket";

interface ChatWindowProps {
  conversation: TConversation;
  currentUserId: string;
  currentUserEmail?: string;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
  currentUserEmail,
  onBack,
}) => {
  const conversationId = conversation._id;

  // Socket-driven typing indicator state
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  // RTK Query hooks
  const {
    data: messagesResponse,
    isLoading,
    isUninitialized,
    refetch,
  } = useGetConversationMessagesQuery(
    { conversationId, sort: "createdAt", limit: 200 },
    { skip: !conversationId }
  );

  const [sendMessageApi] = useSendMessageMutation();
  const [markAsReadApi] = useMarkMessagesAsReadMutation();
  const [archiveConversationApi] = useArchiveConversationMutation();

  // Simple direct assignment - no unnecessary useMemo per instructions
  const messages = messagesResponse?.data || [];

  // Determine other participant
  const myEmail = currentUserEmail?.toLowerCase();
  const otherParticipant: TParticipant | undefined =
    conversation.participants?.find((p) => {
      if (!p) return false;
      const pId = typeof p === "string" ? p : p?._id;
      const pEmail = typeof p === "object" ? p?.email?.toLowerCase() : null;
      if (currentUserId && pId && pId.toString() === currentUserId.toString()) return false;
      if (myEmail && pEmail && pEmail === myEmail) return false;
      return true;
    }) || conversation.participants?.[0];

  const participantName = otherParticipant?.name || "Participant";
  const participantRole = (otherParticipant?.role || "USER").toUpperCase();
  const isVendorParticipant = participantRole === "VENDOR";
  // TVendor has logo, while TCustomer and TAdmin have avatar
  const participantImage = isVendorParticipant
    ? otherParticipant?.logo || otherParticipant?.avatar
    : otherParticipant?.avatar;

  // 1. Join conversation room & mark messages as read on mount/change
  useEffect(() => {
    if (!conversationId) return;

    joinConversationRoom(conversationId);
    markAsReadApi(conversationId);

    return () => {
      leaveConversationRoom(conversationId);
    };
  }, [conversationId, markAsReadApi]);

  // 2. Listen for typing events in this conversation
  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    const handleUserTyping = (payload: TTypingEventPayload) => {
      if (
        payload.conversationId === conversationId &&
        payload.userId !== currentUserId
      ) {
        setIsOtherUserTyping(true);
      }
    };

    const handleUserStopTyping = (payload: TTypingEventPayload) => {
      if (
        payload.conversationId === conversationId &&
        payload.userId !== currentUserId
      ) {
        setIsOtherUserTyping(false);
      }
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("userTyping", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);
    socket.on("userStoppedTyping", handleUserStopTyping);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("userTyping", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
      socket.off("userStoppedTyping", handleUserStopTyping);
      setIsOtherUserTyping(false);
    };
  }, [conversationId, currentUserId]);

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessageApi({
        conversation: conversationId,
        message: text,
        messageType: "TEXT",
      }).unwrap();
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      toast.error(errorObj?.data?.message || errorObj?.message || "Failed to send message");
    }
  };

  const handleArchive = async () => {
    try {
      await archiveConversationApi(conversationId).unwrap();
      toast.success("Conversation archived");
      if (onBack) onBack();
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      toast.error(errorObj?.data?.message || "Failed to archive");
    }
  };

  const handleRefreshMessages = () => {
    if (!isUninitialized && typeof refetch === "function") {
      try {
        const promise = refetch();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => { });
        }
      } catch {
        // Query not ready or skipped
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#120824]/90 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 bg-[#170d2f]/95 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="btn btn-ghost btn-circle btn-sm md:hidden shrink-0"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Avatar / Vendor Logo */}
          <div className="avatar shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/30 to-amber-500/20 border border-white/15 flex items-center justify-center font-bold text-amber-400 overflow-hidden relative shadow-sm">
              {participantImage ? (
                <Image
                  src={participantImage}
                  alt={participantName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : isVendorParticipant ? (
                <Store className="w-5 h-5 text-amber-400" />
              ) : participantRole === "ADMIN" || participantRole === "SUPER_ADMIN" ? (
                <Shield className="w-5 h-5 text-primary" />
              ) : (
                participantName[0]?.toUpperCase()
              )}
            </div>
          </div>

          {/* Participant Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate">
                {participantName}
              </h3>
              <span
                className={`badge badge-xs text-[10px] font-semibold ${participantRole === "ADMIN" || participantRole === "SUPER_ADMIN"
                  ? "badge-primary"
                  : participantRole === "VENDOR"
                    ? "badge-warning"
                    : "badge-ghost bg-white/10 text-slate-200 border-white/15"
                  }`}
              >
                {participantRole === "ADMIN" || participantRole === "SUPER_ADMIN" ? (
                  <span className="flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Support
                  </span>
                ) : participantRole === "VENDOR" ? (
                  <span className="flex items-center gap-1">
                    <Store className="w-2.5 h-2.5" /> Vendor
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-2.5 h-2.5" /> Customer
                  </span>
                )}
              </span>
            </div>

            <div className="text-xs truncate">
              {isOtherUserTyping ? (
                <span className="text-amber-400 font-medium flex items-center gap-1 animate-pulse">
                  typing...
                </span>
              ) : (
                <span className="text-slate-400">
                  {conversation.conversationType === "ORDER"
                    ? "Order Discussion"
                    : conversation.conversationType === "DISPUTE"
                      ? "Dispute Support"
                      : "Direct Chat"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleRefreshMessages}
            className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Refresh messages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Chat options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content z-20 menu p-2 shadow-xl bg-[#170d2f] text-slate-100 rounded-box w-48 border border-white/10 text-xs mt-1"
            >
              <li>
                <button onClick={handleArchive} className="text-error">
                  <Archive className="w-4 h-4" />
                  Archive Conversation
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Linked Order Banner if conversationType === "ORDER" or conversation.order exists */}
      {conversation.order && (
        <div className="px-4 py-2 bg-info/10 border-b border-info/20 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-info font-medium truncate">
            <Package className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Order #
              {typeof conversation.order === "object"
                ? conversation.order.orderNo || conversation.order._id
                : conversation.order}
            </span>
            {typeof conversation.order === "object" && conversation.order.status && (
              <span className="badge badge-xs badge-info font-bold uppercase">
                {conversation.order.status}
              </span>
            )}
            {typeof conversation.order === "object" &&
              conversation.order.totalPrice !== undefined && (
                <span className="text-base-content/70 font-mono text-[11px]">
                  ${Number(conversation.order.totalPrice).toFixed(2)}
                </span>
              )}
          </div>
        </div>
      )}

      {/* Linked Dispute Banner if conversationType === "DISPUTE" */}
      {conversation.conversationType === "DISPUTE" && (
        <div className="px-4 py-2 bg-error/10 border-b border-error/20 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-error font-medium truncate">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>Dispute Resolution Channel</span>
          </div>
        </div>
      )}

      {/* Message List */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        currentUserEmail={currentUserEmail}
        isOtherUserTyping={isOtherUserTyping}
        otherUserName={participantName}
        otherUserAvatar={participantImage}
        otherUserRole={participantRole}
        isLoading={isLoading}
      />

      {/* Message Input */}
      <MessageInput
        conversationId={conversationId}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
