"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSocket } from "../lib/socket";
import {
  TNotification,
  TSocketConnectionStatus,
} from "../types/notification";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentUser,
  useCurrentToken,
} from "@/src/redux/features/auth/authSlice";
import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useClearAllNotificationsMutation,
  useDeleteNotificationMutation,
} from "@/src/redux/features/notification/notificationApi";

interface NotificationContextType {
  notifications: TNotification[];
  unreadCount: number;
  status: TSocketConnectionStatus;
  activeToasts: TNotification[];
  isLoading: boolean;
  refetchNotifications: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  dismissToast: (id: string) => void;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Helper: Synthesize an audio notification chime with Web Audio API
const playNotificationSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.08);
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio might be blocked by browser autoplay policy until user interacts
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(useCurrentToken);

  const [activeToasts, setActiveToasts] = useState<TNotification[]>([]);
  const [status, setStatus] = useState<TSocketConnectionStatus>("connecting");

  // Query real notifications from database via RTK Query
  const {
    data: notifResponse,
    isLoading,
    refetch,
  } = useGetMyNotificationsQuery(
    { limit: 50 },
    { skip: !token }
  );

  const [markAsReadApi] = useMarkAsReadMutation();
  const [markAllAsReadApi] = useMarkAllAsReadMutation();
  const [clearAllApi] = useClearAllNotificationsMutation();
  const [deleteNotificationApi] = useDeleteNotificationMutation();

  // Map API response to clean notification objects
  const notifications: TNotification[] = useMemo(() => {
    if (!token || !notifResponse?.data || !Array.isArray(notifResponse.data)) {
      return [];
    }

    return notifResponse.data.map((item: any) => {
      const msg = item.message || "";
      let title = "Notification";
      if (item.type === "NEW_ACCOUNT") {
        title = msg.toLowerCase().includes("vendor")
          ? "New Vendor Registered"
          : "New Customer Registered";
      } else {
        title = formatNotificationTitle(item.type);
      }

      return {
        id: item._id,
        _id: item._id,
        notificationId: item._id,
        type: item.type,
        title,
        message: msg,
        relatedId: item.relatedId,
        recipientRole: item.recipientRole,
        recipientId: item.recipientId,
        isRead: item.isRead ?? false,
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });
  }, [token, notifResponse]);

  const dismissToast = useCallback((id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle incoming live notification event from Socket.IO
  const handleIncomingNotification = useCallback(
    (data: any, fallbackType = "general") => {
      if (!data) return;

      // Filter: if user has a role, ensure incoming notification matches
      if (user?.role) {
        const userRole = (user.role as string).toUpperCase();
        if (data.recipientRole) {
          const notifRole = (data.recipientRole as string).toUpperCase();
          if (
            (notifRole === "ADMIN" || notifRole === "SUPER_ADMIN") &&
            userRole !== "ADMIN" &&
            userRole !== "SUPER_ADMIN"
          ) {
            return;
          }
          if (notifRole === "VENDOR" && userRole !== "VENDOR") return;
          if (notifRole === "CUSTOMER" && userRole !== "CUSTOMER") return;
        }

        const currentUserId = (user as any)._id || (user as any).id;
        if (
          data.recipientId &&
          currentUserId &&
          userRole !== "ADMIN" &&
          userRole !== "SUPER_ADMIN"
        ) {
          if (data.recipientId.toString() !== currentUserId.toString()) {
            return;
          }
        }
      }

      const notifId =
        data.notificationId ||
        data._id ||
        data.id ||
        `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

      const type = data.type || fallbackType;
      const message =
        data.message ||
        (typeof data === "string" ? data : "You received a new update.");

      const newNotif: TNotification = {
        id: notifId,
        _id: data._id || data.notificationId || notifId,
        notificationId: data.notificationId || notifId,
        type,
        title: data.title || formatNotificationTitle(type),
        message,
        relatedId: data.relatedId,
        recipientRole: data.recipientRole,
        recipientId: data.recipientId,
        isRead: false,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      // Toast alert
      setActiveToasts((prev) => [newNotif, ...prev.slice(0, 2)]);
      setTimeout(() => {
        dismissToast(newNotif.id);
      }, 6000);

      // Chime audio
      playNotificationSound();

      // Refetch from database so state and meta stay perfectly in sync
      if (token) {
        refetch();
      }
    },
    [user, token, dismissToast, refetch]
  );

  // Setup Socket.IO listener according to authenticated user
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => {
      setStatus("connected");

      // Join appropriate socket rooms based on user role
      if (user?.role) {
        const userRole = (user.role as string).toUpperCase();
        const userId = (user as any)._id || (user as any).id;

        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          socket.emit("join_room", "admin_dashboard");
          socket.emit("join_room", "ADMIN");
          socket.emit("join_room", "SUPER_ADMIN");
        } else if (userRole === "VENDOR" && userId) {
          socket.emit("join_room", `vendor:${userId}`);
        } else if (userRole === "CUSTOMER" && userId) {
          socket.emit("join_room", `customer:${userId}`);
        }
      }
    };

    const onDisconnect = () => {
      setStatus("disconnected");
    };

    const onConnectError = () => {
      setStatus("error");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // Primary unified notification event
    socket.on("notification", (data) => {
      handleIncomingNotification(data, "notification");
    });

    // Server-specific order and payment events
    const specificEvents = [
      "NEW_ORDER",
      "new_order",
      "ORDER_DELIVERED",
      "order_delivered",
      "ORDER_SHIPPED",
      "order_shipped",
      "ORDER_CANCELLED",
      "order_cancelled",
      "NEW_ACCOUNT",
      "payment_success",
      "payment_failed",
      "payment_refunded",
      "fraud_alert",
      "SLA_WARNING",
      "SLA_SUSPENDED",
    ];

    specificEvents.forEach((eventName) => {
      socket.on(eventName, (data) => {
        handleIncomingNotification(data, eventName);
      });
    });

    if (!socket.connected) {
      socket.connect();
    } else {
      setStatus("connected");
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("notification");
      specificEvents.forEach((evt) => socket.off(evt));
    };
  }, [user, handleIncomingNotification]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsReadApi(id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as read in database:", err);
      }
    },
    [markAsReadApi]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadApi().unwrap();
    } catch (err) {
      console.error("Failed to mark all notifications as read in database:", err);
    }
  }, [markAllAsReadApi]);

  const removeNotification = useCallback(
    async (id: string) => {
      try {
        await deleteNotificationApi(id).unwrap();
      } catch (err) {
        console.error("Failed to delete notification from database:", err);
      }
    },
    [deleteNotificationApi]
  );

  const clearAll = useCallback(async () => {
    try {
      await clearAllApi().unwrap();
    } catch (err) {
      console.error("Failed to clear notifications in database:", err);
    }
  }, [clearAllApi]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        status,
        activeToasts,
        isLoading,
        refetchNotifications: refetch,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        dismissToast,
        playNotificationSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Formatter utility
function formatNotificationTitle(type: string): string {
  switch (type?.toUpperCase()) {
    case "NEW_ORDER":
      return "New Order Received";
    case "ORDER_DELIVERED":
      return "Order Delivered";
    case "ORDER_SHIPPED":
      return "Order Shipped";
    case "ORDER_CANCELLED":
      return "Order Cancelled";
    case "PAYMENT_SUCCESS":
      return "Payment Succeeded";
    case "PAYMENT_FAILED":
      return "Payment Issue";
    case "PAYMENT_REFUNDED":
      return "Payment Refunded";
    case "NEW_ACCOUNT":
      return "New Account Created";
    case "SLA_WARNING":
      return "SLA Performance Warning";
    case "SLA_SUSPENDED":
      return "Account SLA Suspension";
    case "FRAUD_ALERT":
      return "Fraud Detection Alert";
    default:
      return "System Notification";
  }
}
