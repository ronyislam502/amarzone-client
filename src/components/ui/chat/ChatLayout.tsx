"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentUser,
  useCurrentToken,
} from "@/src/redux/features/auth/authSlice";
import { useGetUserConversationsQuery } from "@/src/redux/features/chat/chatApi";
import { authenticateSocket, getSocket } from "@/src/lib/socket";
import { TConversation } from "@/src/types/chat";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { EmptyChatState } from "./EmptyChatState";
import { NewConversationModal } from "./NewConversationModal";

interface ChatLayoutProps {
  mode?: "all" | "vendor" | "support";
  initialConversationId?: string;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  mode = "all",
  initialConversationId,
}) => {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const currentUserId = (user as any)?._id || (user as any)?.id || "";

  // Active conversation state (genuine UI state)
  const [activeConversation, setActiveConversation] =
    useState<TConversation | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Authenticate socket on mount or auth change
  useEffect(() => {
    if (token) {
      authenticateSocket(token, user);
    }
  }, [token, user]);

  // RTK Query: fetch user conversations
  const {
    data: convsResponse,
    isLoading,
    refetch,
  } = useGetUserConversationsQuery(undefined, {
    skip: !token,
  });

  // Direct assignment without unnecessary useMemo
  const allConversations = convsResponse?.data || [];

  // Filter conversations by mode
  // mode="vendor" shows NORMAL, ORDER, DISPUTE (exclude SUPPORT)
  // mode="support" shows SUPPORT conversations only
  // mode="all" shows everything
  const conversations =
    mode === "support"
      ? allConversations.filter((c) => c.conversationType === "SUPPORT")
      : mode === "vendor"
      ? allConversations.filter((c) => c.conversationType !== "SUPPORT")
      : allConversations;

  // Auto-select initial conversation if provided in props or URL search params
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const targetId = initialConversationId || params.get("conversationId");
    if (targetId && conversations.length > 0 && !activeConversation) {
      const matched = conversations.find((c) => c._id === targetId);
      if (matched) {
        setActiveConversation(matched);
      }
    }
  }, [initialConversationId, conversations, activeConversation]);

  // When a new conversation arrives, update active conversation if matched
  useEffect(() => {
    if (activeConversation) {
      const updated = allConversations.find((c) => c._id === activeConversation._id);
      if (updated) {
        setActiveConversation(updated);
      }
    }
  }, [allConversations]);

  const handleSelectConversation = (conversation: TConversation) => {
    setActiveConversation(conversation);
  };

  const handleNewConversationSuccess = (conversation: TConversation) => {
    setActiveConversation(conversation);
    refetch();
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[550px] max-h-[850px] flex gap-4 overflow-hidden">
      {/* Sidebar: Conversation List */}
      {/* On mobile: visible only when no conversation is active */}
      <div
        className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
          activeConversation ? "hidden md:flex flex-col" : "flex flex-col"
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?._id || null}
          currentUserId={currentUserId}
          onSelectConversation={handleSelectConversation}
          onStartNew={() => setIsNewModalOpen(true)}
          isLoading={isLoading}
        />
      </div>

      {/* Main Area: Active Chat or Empty State */}
      {/* On mobile: visible only when conversation is active */}
      <div
        className={`flex-1 h-full ${
          activeConversation ? "flex flex-col" : "hidden md:flex flex-col"
        }`}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={currentUserId}
            onBack={() => setActiveConversation(null)}
          />
        ) : (
          <EmptyChatState onStartNew={() => setIsNewModalOpen(true)} />
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={handleNewConversationSuccess}
        currentUserId={currentUserId}
        defaultTab={mode === "support" ? "support" : "vendors"}
        allowedTabs={
          mode === "support"
            ? ["support"]
            : mode === "vendor"
            ? ["vendors", "manual"]
            : ["vendors", "support", "manual"]
        }
      />
    </div>
  );
};
