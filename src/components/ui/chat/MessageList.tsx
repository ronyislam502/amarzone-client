"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Check, CheckCheck, FileText, Image as ImageIcon, Store, Shield } from "lucide-react";
import { TMessage } from "@/types/chat";

interface MessageListProps {
  messages: TMessage[];
  currentUserId: string;
  currentUserEmail?: string;
  isOtherUserTyping?: boolean;
  otherUserName?: string;
  otherUserAvatar?: string;
  otherUserRole?: string;
  isLoading?: boolean;
}

const formatMessageTime = (dateString?: string | Date): string => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const formatDateSeparator = (dateString?: string | Date): string => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  currentUserEmail,
  isOtherUserTyping = false,
  otherUserName = "User",
  otherUserAvatar,
  otherUserRole,
  isLoading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Strictly sort messages chronologically (oldest first, newest last)
  const sortedMessages = React.useMemo(() => {
    if (!messages || !Array.isArray(messages)) return [];
    return [...messages].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeA - timeB;
    });
  }, [messages]);

  // Deduplicate by message ID while preserving chronological order
  const displayMessages = React.useMemo(() => {
    const seen = new Set<string>();
    const unique: TMessage[] = [];
    for (const msg of sortedMessages) {
      const key =
        msg._id ||
        `${msg.createdAt}-${typeof msg.sender === "object" ? msg.sender?._id : msg.sender
        }`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(msg);
      }
    }
    return unique;
  }, [sortedMessages]);

  // Auto-scroll to bottom on messages update or typing indicator change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages.length, isOtherUserTyping]);

  // Find index of the latest read message sent by current user for the seen avatar indicator
  const lastReadMineIndex = React.useMemo(() => {
    for (let i = displayMessages.length - 1; i >= 0; i--) {
      const m = displayMessages[i];
      const sId = typeof m.sender === "string" ? m.sender : m.sender?._id;
      const sEmail = typeof m.sender === "object" ? m.sender?.email?.toLowerCase() : null;
      const myEmail = currentUserEmail?.toLowerCase();
      const isMine =
        (currentUserId && sId ? sId.toString() === currentUserId.toString() : false) ||
        (myEmail && sEmail ? sEmail === myEmail : false);
      const isRead = m.status === "READ" || Boolean(m.readAt);
      if (isMine && isRead) {
        return i;
      }
    }
    return -1;
  }, [displayMessages, currentUserId, currentUserEmail]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-md text-primary" />
          <p className="text-xs text-base-content/50">Loading message history...</p>
        </div>
      </div>
    );
  }

  if (displayMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-base-content/50">
        <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-base-content/40" />
        </div>
        <p className="text-sm font-medium text-base-content/70">No messages yet</p>
        <p className="text-xs text-base-content/50 max-w-xs mt-1">
          Say hello to start the real-time conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#120824]/60">
      {displayMessages.map((msg, index) => {
        const senderId =
          typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
        const senderEmail =
          typeof msg.sender === "object" ? msg.sender?.email?.toLowerCase() : null;
        const myEmail = currentUserEmail?.toLowerCase();
        const isMine =
          (currentUserId && senderId ? senderId.toString() === currentUserId.toString() : false) ||
          (myEmail && senderEmail ? senderEmail === myEmail : false);

        const senderRole =
          (typeof msg.sender === "object" ? msg.sender?.role : undefined) ||
          (!isMine ? otherUserRole : "CUSTOMER");
        const isVendorSender = senderRole?.toUpperCase() === "VENDOR";

        const senderName =
          (typeof msg.sender === "object" ? msg.sender?.name : undefined) ||
          (!isMine ? otherUserName : "Me");

        // Vendor interface uses `logo`, while Customer and Admin use `avatar`
        const senderAvatar =
          (typeof msg.sender === "object"
            ? (isVendorSender ? (msg.sender as any)?.logo || msg.sender?.avatar : msg.sender?.avatar)
            : undefined) ||
          (!isMine ? otherUserAvatar : undefined);

        // Show date separator if first message or date changed
        const prevMsg = displayMessages[index - 1];
        const currentDate = new Date(msg.createdAt).toDateString();
        const prevDate = prevMsg
          ? new Date(prevMsg.createdAt).toDateString()
          : null;
        const showDateSeparator = currentDate !== prevDate;

        return (
          <React.Fragment key={msg._id || index}>
            {showDateSeparator && (
              <div className="flex items-center justify-center my-4">
                <div className="px-3 py-1 rounded-full bg-[#1c123b] text-[11px] font-medium text-slate-300 shadow-md border border-white/10">
                  {formatDateSeparator(msg.createdAt)}
                </div>
              </div>
            )}

            <div className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
              {!isMine && (
                <div className="chat-image avatar">
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold overflow-hidden relative shadow-sm ${
                      isVendorSender
                        ? "bg-amber-500/15 text-amber-400 border-amber-400/30"
                        : "bg-white/10 text-white border-white/15"
                    }`}
                  >
                    {senderAvatar ? (
                      <Image
                        src={senderAvatar}
                        alt={senderName || (isVendorSender ? "Vendor Logo" : "User Avatar")}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : isVendorSender ? (
                      <Store className="w-4 h-4 text-amber-400" />
                    ) : senderRole?.toUpperCase() === "ADMIN" || senderRole?.toUpperCase() === "SUPER_ADMIN" ? (
                      <Shield className="w-4 h-4 text-primary" />
                    ) : (
                      (senderName || "U")[0]?.toUpperCase()
                    )}
                  </div>
                </div>
              )}

              <div className="chat-header text-[11px] text-slate-400 mb-0.5 flex items-center gap-1.5">
                {!isMine && (
                  <span className="font-semibold text-slate-200">
                    {senderName}
                  </span>
                )}
                <time className="text-[10px] opacity-70">
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>

              <div
                className={`chat-bubble text-sm leading-relaxed shadow-md break-words ${isMine
                  ? "chat-bubble-primary text-primary-content"
                  : "bg-[#1c123b] text-white border border-white/10"
                  }`}
              >
                {/* Text Message */}
                {(msg.message || (msg as any).text) && (
                  <p>{msg.message || (msg as any).text}</p>
                )}

                {/* Attachments if any */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.attachments.map((att, attIdx) => (
                      <div
                        key={attIdx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-black/10 text-xs"
                      >
                        {att.type?.startsWith("image") ? (
                          <ImageIcon className="w-4 h-4 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 shrink-0" />
                        )}
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline truncate hover:opacity-80"
                        >
                          {att.fileName || "Attachment"}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isMine && (
                <div className="chat-footer text-[10px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                  {msg.status === "READ" || Boolean(msg.readAt) ? (
                    index === lastReadMineIndex && otherUserAvatar ? (
                      <div
                        className="w-4 h-4 rounded-full overflow-hidden border border-white/20 shadow-xs relative mt-0.5"
                        title={`Seen by ${otherUserName}`}
                      >
                        <Image
                          src={otherUserAvatar}
                          alt={otherUserName || "Seen"}
                          width={16}
                          height={16}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <span className="flex items-center text-amber-400 gap-0.5" title="Seen">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span className="text-[9px]">Seen</span>
                      </span>
                    )
                  ) : msg.status === "DELIVERED" ? (
                    <span className="flex items-center gap-0.5 text-slate-400" title="Delivered">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Delivered</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-slate-500" title="Sent">
                      <Check className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Sent</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}

      {/* Typing indicator bubble */}
      {isOtherUserTyping && (
        <div className="chat chat-start animate-fade-in">
          <div className="chat-image avatar">
            <div
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold overflow-hidden relative shadow-sm ${
                otherUserRole?.toUpperCase() === "VENDOR"
                  ? "bg-amber-500/15 text-amber-400 border-amber-400/30"
                  : "bg-white/10 text-white border-white/15"
              }`}
            >
              {otherUserAvatar ? (
                <Image
                  src={otherUserAvatar}
                  alt={otherUserName || "User"}
                  width={28}
                  height={28}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : otherUserRole?.toUpperCase() === "VENDOR" ? (
                <Store className="w-3.5 h-3.5 text-amber-400" />
              ) : otherUserRole?.toUpperCase() === "ADMIN" || otherUserRole?.toUpperCase() === "SUPER_ADMIN" ? (
                <Shield className="w-3.5 h-3.5 text-primary" />
              ) : (
                (otherUserName || "U")[0]?.toUpperCase()
              )}
            </div>
          </div>
          <div className="chat-bubble bg-[#1c123b] text-white border border-white/10 py-2 px-3.5 shadow-md">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
