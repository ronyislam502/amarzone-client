"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ConversationList, TFilterTab } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { EmptyChatState } from "./EmptyChatState";
import { NewConversationModal, TNewConvTab } from "./NewConversationModal";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, useCurrentToken } from "@/redux/features/auth/authSlice";
import { TUser } from "@/types/user";
import { TConversation, TParticipant } from "@/types/chat";
import { authenticateSocket } from "@/lib/socket";
import { useGetUserConversationsQuery } from "@/redux/features/chat/chatApi";

export type TChatMode =
  | "all"
  | "vendor"
  | "support"
  | "customer"
  | "admin"
  | "ALL"
  | "VENDOR"
  | "SUPPORT"
  | "CUSTOMER"
  | "ADMIN"
  | string;

interface ChatLayoutProps {
  mode?: TChatMode;
  initialConversationId?: string;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  mode: propMode,
  initialConversationId,
}) => {
  const user = useAppSelector(selectCurrentUser) as (TUser & { id?: string }) | null;
  const token = useAppSelector(useCurrentToken);
  const currentUserEmail = user?.email || "";

  // Dynamic user role detection from Redux auth
  const userRole = (user?.role || "CUSTOMER").toUpperCase();

  // Dynamic mode resolution:
  // If propMode is provided, normalize it. If omitted or "dynamic", use the logged-in user's role.
  const resolvedMode = (
    propMode && propMode.toLowerCase() !== "dynamic"
      ? propMode
      : userRole
  ).toUpperCase();

  const searchParams = useSearchParams();
  const urlConversationId = searchParams ? searchParams.get("conversationId") : null;
  const urlOrderId = searchParams ? searchParams.get("orderId") : null;

  // Active conversation ID state (derived UI state)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialConversationId || urlConversationId || null
  );
  const [createdConversation, setCreatedConversation] = useState<TConversation | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Active tab filter in sidebar (All, Vendors, Customers, Support, Disputes)
  const [activeFilterTab, setActiveFilterTab] = useState<string>("all");

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
    isUninitialized,
    refetch,
  } = useGetUserConversationsQuery(undefined, {
    skip: !token,
  });

  const allConversations = useMemo(
    () => convsResponse?.data || [],
    [convsResponse?.data]
  );

  // Sync with URL conversationId or orderId query params
  useEffect(() => {
    if (urlConversationId) {
      setSelectedConversationId(urlConversationId);
    } else if (urlOrderId && allConversations.length > 0) {
      const match = allConversations.find((c) => {
        const cOrder = typeof c.order === "object" ? c.order?._id : c.order;
        return cOrder && cOrder.toString() === urlOrderId.toString();
      });
      if (match) {
        setSelectedConversationId(match._id);
      }
    }
  }, [urlConversationId, urlOrderId, allConversations]);

  // Dynamic currentUserId resolution with fallback matching by email against participants
  const currentUserId = useMemo(() => {
    if (user?._id) return user._id;
    if (user?.id) return user.id;
    if (user?.email && allConversations.length > 0) {
      const myEmail = user.email.toLowerCase();
      for (const conv of allConversations) {
        const me = conv.participants?.find((p) => {
          const email = typeof p === "object" ? p?.email : null;
          return email && email.toLowerCase() === myEmail;
        });
        if (me && typeof me === "object" && me._id) {
          return me._id;
        }
      }
    }
    return "";
  }, [user, allConversations]);

  // Helper to extract the counterpart participant in a conversation
  const getOtherParticipant = useCallback(
    (conv: TConversation): TParticipant | undefined => {
      const myEmail = user?.email?.toLowerCase();
      return (
        conv.participants?.find((p) => {
          if (!p) return false;
          const pId = typeof p === "string" ? p : p?._id;
          const pEmail = typeof p === "object" ? p?.email?.toLowerCase() : null;
          if (currentUserId && pId && pId.toString() === currentUserId.toString()) return false;
          if (myEmail && pEmail && pEmail === myEmail) return false;
          return true;
        }) || conv.participants?.[0]
      );
    },
    [currentUserId, user?.email]
  );

  // Determine available filter tabs dynamically based on mode/role
  const filterTabs: TFilterTab[] = useMemo(() => {
    if (resolvedMode === "SUPPORT") {
      return [{ key: "all", label: "Support Tickets", count: allConversations.length }];
    }

    if (resolvedMode === "VENDOR") {
      const customersCount = allConversations.filter((c) => {
        if (c.conversationType === "SUPPORT") return false;
        const other = getOtherParticipant(c);
        const role = (other?.role || "").toUpperCase();
        return role === "CUSTOMER" || role === "USER" || c.conversationType === "ORDER";
      }).length;

      const supportCount = allConversations.filter(
        (c) => c.conversationType === "SUPPORT"
      ).length;

      return [
        { key: "all", label: "All", count: allConversations.length },
        { key: "customers", label: "Customers", count: customersCount },
        { key: "support", label: "Support", count: supportCount },
      ];
    }

    if (resolvedMode === "ADMIN" || resolvedMode === "SUPER_ADMIN") {
      const disputesCount = allConversations.filter(
        (c) => c.conversationType === "DISPUTE"
      ).length;
      const supportCount = allConversations.filter(
        (c) => c.conversationType === "SUPPORT"
      ).length;
      const vendorsCount = allConversations.filter((c) => {
        const other = getOtherParticipant(c);
        return (other?.role || "").toUpperCase() === "VENDOR";
      }).length;
      const customersCount = allConversations.filter((c) => {
        const other = getOtherParticipant(c);
        const role = (other?.role || "").toUpperCase();
        return role === "CUSTOMER" || role === "USER";
      }).length;

      return [
        { key: "all", label: "All", count: allConversations.length },
        { key: "customers", label: "Customers", count: customersCount },
        { key: "vendors", label: "Vendors", count: vendorsCount },
        { key: "disputes", label: "Disputes", count: disputesCount },
        { key: "support", label: "Support", count: supportCount },
      ];
    }

    // Default: CUSTOMER
    const vendorsCount = allConversations.filter((c) => {
      if (c.conversationType === "SUPPORT") return false;
      const other = getOtherParticipant(c);
      const role = (other?.role || "").toUpperCase();
      return role === "VENDOR" || c.conversationType === "ORDER";
    }).length;

    const supportCount = allConversations.filter(
      (c) => c.conversationType === "SUPPORT"
    ).length;

    return [
      { key: "all", label: "All", count: allConversations.length },
      { key: "vendors", label: "Vendors", count: vendorsCount },
      { key: "support", label: "Support", count: supportCount },
    ];
  }, [allConversations, resolvedMode, getOtherParticipant]);

  // Filter conversations by dynamic mode and activeFilterTab
  const conversations = useMemo(() => {
    // Specialized mode="SUPPORT"
    if (resolvedMode === "SUPPORT") {
      return allConversations.filter((c) => c.conversationType === "SUPPORT");
    }

    if (activeFilterTab === "all") {
      return allConversations;
    }

    if (activeFilterTab === "support") {
      return allConversations.filter((c) => c.conversationType === "SUPPORT");
    }

    if (activeFilterTab === "disputes") {
      return allConversations.filter((c) => c.conversationType === "DISPUTE");
    }

    if (activeFilterTab === "vendors") {
      return allConversations.filter((c) => {
        if (c.conversationType === "SUPPORT") return false;
        const other = getOtherParticipant(c);
        const role = (other?.role || "").toUpperCase();
        return role === "VENDOR" || c.conversationType === "ORDER";
      });
    }

    if (activeFilterTab === "customers") {
      return allConversations.filter((c) => {
        if (c.conversationType === "SUPPORT") return false;
        const other = getOtherParticipant(c);
        const role = (other?.role || "").toUpperCase();
        return role === "CUSTOMER" || role === "USER" || c.conversationType === "ORDER";
      });
    }

    return allConversations;
  }, [allConversations, activeFilterTab, resolvedMode, getOtherParticipant]);

  // Resolve target conversation ID from prop, state, or URL search param
  const activeConversationId = useMemo(() => {
    if (selectedConversationId) return selectedConversationId;
    if (urlConversationId) return urlConversationId;
    if (initialConversationId) return initialConversationId;
    return null;
  }, [selectedConversationId, urlConversationId, initialConversationId]);

  // If a conversation ID is active but not in cached conversations, refetch user conversations
  useEffect(() => {
    if (activeConversationId && allConversations.length > 0) {
      const exists = allConversations.some((c) => c._id === activeConversationId);
      if (!exists && !isLoading && !isUninitialized && typeof refetch === "function") {
        try {
          const res = refetch();
          if (res && typeof res.catch === "function") res.catch(() => { });
        } catch { }
      }
    }
  }, [activeConversationId, allConversations, isLoading, isUninitialized, refetch]);

  // Active conversation object dynamically found in allConversations, newly created conversation, or sessionStorage
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    const found = allConversations.find((c) => c._id === activeConversationId);
    if (found) return found;
    if (createdConversation && createdConversation._id === activeConversationId) {
      return createdConversation;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("lastCreatedChat");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?._id === activeConversationId) {
            return parsed as TConversation;
          }
        }
      } catch { }
    }
    return null;
  }, [allConversations, activeConversationId, createdConversation]);

  const handleSelectConversation = (conversation: TConversation) => {
    setSelectedConversationId(conversation._id);
  };

  const handleNewConversationSuccess = (conversation: TConversation) => {
    setCreatedConversation(conversation);
    setSelectedConversationId(conversation._id);
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

  // Determine allowedTabs and defaultTab for the modal dynamically
  const modalDefaultTab: TNewConvTab = useMemo(() => {
    if (resolvedMode === "SUPPORT") return "support";
    if (resolvedMode === "VENDOR") return "customers";
    if (resolvedMode === "ADMIN" || resolvedMode === "SUPER_ADMIN") return "customers";
    return "vendors";
  }, [resolvedMode]);

  const modalAllowedTabs: TNewConvTab[] = useMemo(() => {
    if (resolvedMode === "SUPPORT") return ["support", "manual"];
    if (resolvedMode === "VENDOR") return ["customers", "support", "manual"];
    if (resolvedMode === "CUSTOMER") return ["vendors", "support", "manual"];
    return ["customers", "vendors", "support", "manual"];
  }, [resolvedMode]);

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl w-full h-[calc(100vh-140px)] min-h-[550px] max-h-[850px] p-3 sm:p-4 my-2">
      {/* Top glowing accent border ray matching categories header */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-15 pointer-events-none" />

      {/* Main chat inner frame */}
      <div className="relative z-10 w-full h-full flex gap-3 sm:gap-4 overflow-hidden">
        {/* Sidebar: Conversation List */}
        {/* On mobile: visible only when no conversation is active */}
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${activeConversation ? "hidden md:flex flex-col" : "flex flex-col"
            }`}
        >
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation?._id || null}
            currentUserId={currentUserId}
            currentUserEmail={currentUserEmail}
            onSelectConversation={handleSelectConversation}
            onStartNew={() => setIsNewModalOpen(true)}
            isLoading={isLoading}
            filterTabs={filterTabs}
            activeFilterTab={activeFilterTab}
            onFilterTabChange={(tabKey) => setActiveFilterTab(tabKey)}
          />
        </div>

        {/* Main Area: Active Chat or Empty State */}
        {/* On mobile: visible only when conversation is active */}
        <div
          className={`flex-1 h-full ${activeConversation ? "flex flex-col" : "hidden md:flex flex-col"
            }`}
        >
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              currentUserId={currentUserId}
              currentUserEmail={currentUserEmail}
              onBack={() => setSelectedConversationId(null)}
            />
          ) : (
            <EmptyChatState onStartNew={() => setIsNewModalOpen(true)} />
          )}
        </div>
      </div>

      {/* New Conversation Modal with Dynamic Role-Based Tabs */}
      <NewConversationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={handleNewConversationSuccess}
        currentUserId={currentUserId}
        defaultTab={modalDefaultTab}
        allowedTabs={modalAllowedTabs}
      />
    </div>
  );
};
