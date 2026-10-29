"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { emitStopTyping, emitTyping } from "@/lib/socket";
import AZInput from "@/components/shared/form/AZInput";

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
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-[#170d2f]/95 border-t border-white/10 backdrop-blur-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1" onKeyDown={handleKeyDown}>
          <AZInput
            name="message"
            value={text}
            onChange={handleInputChange}
            disabled={disabled || isSending}
            placeholder="Type your message..."
            className="w-full"
            clearable={Boolean(text)}
            onClear={() => setText("")}
          />
        </div>

        <button
          type="submit"
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
      </form>
    </div>
  );
};
