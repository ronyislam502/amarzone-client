"use client";

import React, { useEffect, useRef } from "react";
import { TMessage } from "@/src/types/chat";
import { Check, CheckCheck, FileText, Image as ImageIcon } from "lucide-react";

interface MessageListProps {
  messages: TMessage[];
  currentUserId: string;
  isOtherUserTyping?: boolean;
  otherUserName?: string;
  isLoading?: boolean;
}

function formatMessageTime(dateString?: string | Date) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatDateSeparator(dateString?: string | Date) {
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
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isOtherUserTyping = false,
  otherUserName = "User",
  isLoading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on messages update or typing indicator change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherUserTyping]);

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

  if (messages.length === 0) {
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
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => {
        const senderId =
          typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
        const isMine =
          currentUserId && senderId
            ? senderId.toString() === currentUserId.toString()
            : false;

        const senderName =
          typeof msg.sender === "object" ? msg.sender?.name : "Participant";
        const senderAvatar =
          typeof msg.sender === "object" ? msg.sender?.avatar : undefined;

        // Show date separator if first message or date changed
        const prevMsg = messages[index - 1];
        const currentDate = new Date(msg.createdAt).toDateString();
        const prevDate = prevMsg
          ? new Date(prevMsg.createdAt).toDateString()
          : null;
        const showDateSeparator = currentDate !== prevDate;

        return (
          <React.Fragment key={msg._id || index}>
            {showDateSeparator && (
              <div className="flex items-center justify-center my-4">
                <div className="px-3 py-1 rounded-full bg-base-200/80 text-[11px] font-medium text-base-content/60 shadow-sm border border-base-content/5">
                  {formatDateSeparator(msg.createdAt)}
                </div>
              </div>
            )}

            <div className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
              {!isMine && (
                <div className="chat-image avatar">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold">
                    {senderAvatar ? (
                      <img src={senderAvatar} alt={senderName || "User"} />
                    ) : (
                      (senderName || "U")[0]?.toUpperCase()
                    )}
                  </div>
                </div>
              )}

              <div className="chat-header text-[11px] text-base-content/50 mb-0.5 flex items-center gap-1.5">
                {!isMine && (
                  <span className="font-semibold text-base-content/80">
                    {senderName}
                  </span>
                )}
                <time className="text-[10px] opacity-70">
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>

              <div
                className={`chat-bubble text-sm leading-relaxed shadow-sm break-words ${
                  isMine
                    ? "chat-bubble-primary text-primary-content"
                    : "bg-base-200 text-base-content border border-base-content/10"
                }`}
              >
                {/* Text Message */}
                {msg.message && <p>{msg.message}</p>}

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
                <div className="chat-footer text-[10px] text-base-content/40 mt-0.5 flex items-center gap-1">
                  {msg.status === "READ" ? (
                    <span className="flex items-center text-primary gap-0.5" title="Read">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </span>
                  ) : msg.status === "DELIVERED" ? (
                    <span className="flex items-center gap-0.5" title="Delivered">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5" title="Sent">
                      <Check className="w-3.5 h-3.5" />
                      <span>Sent</span>
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
            <div className="w-7 h-7 rounded-full bg-base-300 text-base-content/70 flex items-center justify-center text-xs font-bold">
              {(otherUserName || "U")[0]?.toUpperCase()}
            </div>
          </div>
          <div className="chat-bubble bg-base-200 text-base-content border border-base-content/10 py-2 px-3.5">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
