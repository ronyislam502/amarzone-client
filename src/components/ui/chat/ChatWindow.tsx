"use client";

import React, { useState, useEffect } from "react";
import {
  TConversation,
  TParticipant,
  TTypingEventPayload,
} from "@/src/types/chat";
import {
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useArchiveConversationMutation,
} from "@/src/redux/features/chat/chatApi";
import {
  getSocket,
  joinConversationRoom,
  leaveConversationRoom,
} from "@/src/lib/socket";
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

interface ChatWindowProps {
  conversation: TConversation;
  currentUserId: string;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
  onBack,
}) => {
  const conversationId = conversation._id;

  // Socket-driven typing indicator state
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  // RTK Query hooks
  const {
    data: messagesResponse,
    isLoading,
    refetch,
  } = useGetConversationMessagesQuery(
    { conversationId },
    { skip: !conversationId }
  );

  const [sendMessageApi] = useSendMessageMutation();
  const [markAsReadApi] = useMarkMessagesAsReadMutation();
  const [archiveConversationApi] = useArchiveConversationMutation();

  // Simple direct assignment - no unnecessary useMemo per instructions
  const messages = messagesResponse?.data || [];

  // Determine other participant
  const otherParticipant: TParticipant | undefined =
    conversation.participants?.find((p) => {
      const pId = typeof p === "string" ? p : p?._id;
      return pId && pId.toString() !== currentUserId?.toString();
    }) || conversation.participants?.[0];

  const participantName = otherParticipant?.name || "Participant";
  const participantRole = (otherParticipant?.role || "USER").toUpperCase();
  const participantAvatar = otherParticipant?.avatar;

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
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to send message");
    }
  };

  const handleArchive = async () => {
    try {
      await archiveConversationApi(conversationId).unwrap();
      toast.success("Conversation archived");
      if (onBack) onBack();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to archive");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-base-100/50 backdrop-blur-sm rounded-2xl border border-base-content/10 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-base-100/90 border-b border-base-content/10 flex items-center justify-between gap-3 shrink-0">
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

          {/* Avatar */}
          <div className="avatar shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 border border-base-content/10 flex items-center justify-center font-bold text-primary">
              {participantAvatar ? (
                <img src={participantAvatar} alt={participantName} />
              ) : (
                participantName[0]?.toUpperCase()
              )}
            </div>
          </div>

          {/* Participant Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-base-content truncate">
                {participantName}
              </h3>
              <span
                className={`badge badge-xs text-[10px] font-semibold ${
                  participantRole === "ADMIN" || participantRole === "SUPER_ADMIN"
                    ? "badge-primary"
                    : participantRole === "VENDOR"
                    ? "badge-warning"
                    : "badge-ghost"
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
                <span className="text-primary font-medium flex items-center gap-1 animate-pulse">
                  typing...
                </span>
              ) : (
                <span className="text-base-content/50">
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
            onClick={() => refetch()}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
            title="Refresh messages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle btn-sm text-base-content/60"
              aria-label="Chat options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content z-20 menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-content/10 text-xs mt-1"
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
        isOtherUserTyping={isOtherUserTyping}
        otherUserName={participantName}
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
