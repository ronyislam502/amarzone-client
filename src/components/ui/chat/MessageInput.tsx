"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { emitTyping, emitStopTyping } from "@/src/lib/socket";

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  onSendMessage,
  disabled = false,
}) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear typing timeout when unmounting or conversation changes
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        emitStopTyping(conversationId);
      }
    };
  }, [conversationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);

    // Emit typing indicator
    if (conversationId && value.trim()) {
      emitTyping(conversationId);

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      typingTimerRef.current = setTimeout(() => {
        emitStopTyping(conversationId);
      }, 1800);
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;

    try {
      setIsSending(true);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      emitStopTyping(conversationId);

      await onSendMessage(trimmed);
      setText("");
    } catch {
      // Error handled in parent/hook
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-base-100/90 border-t border-base-content/10 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSending}
            placeholder="Type your message..."
            className="input input-bordered w-full pr-10 rounded-2xl bg-base-200/50 border-base-content/10 focus:border-primary focus:outline-none text-sm transition-all shadow-inner placeholder:text-base-content/40"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled || isSending}
          className="btn btn-primary btn-circle btn-sm w-10 h-10 shadow-md shadow-primary/20 shrink-0"
          aria-label="Send message"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Send className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
