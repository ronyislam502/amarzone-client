"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSocket, joinUserRooms } from "../lib/socket";
import {
  TNotification,
  TSocketConnectionStatus,
} from "../types/notification";

interface NotificationContextType {
  notifications: TNotification[];
  unreadCount: number;
  status: TSocketConnectionStatus;
  activeToasts: TNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  dismissToast: (id: string) => void;
  sendTestNotification: (overrides?: Partial<TNotification>) => void;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Initial placeholder mock notifications to show rich UI on first load
const INITIAL_NOTIFICATIONS: TNotification[] = [
  {
    id: "notif-init-1",
    type: "NEW_ORDER",
    title: "Order Placed",
    message: "A new order #AZ-9824 has been placed successfully.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: "notif-init-2",
    type: "payment_success",
    title: "Payment Received",
    message: "Payment of $149.00 confirmed for Order #AZ-9824.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: "notif-init-3",
    type: "ORDER_SHIPPED",
    title: "Order Dispatched",
    message: "Package with tracking #TRK-58210 has been handed to carrier.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
];

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

const STORAGE_KEY = "amarzone_notifications_list";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [activeToasts, setActiveToasts] = useState<TNotification[]>([]);
  const [status, setStatus] = useState<TSocketConnectionStatus>("connecting");

  // Load saved notifications or fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setNotifications(INITIAL_NOTIFICATIONS);
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(notifications.slice(0, 30))
        );
      } catch {
        // ignore
      }
    }
  }, [notifications]);

  const dismissToast = useCallback((id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle incoming raw socket notification
  const handleIncomingNotification = useCallback(
    (data: any, fallbackType = "general") => {
      if (!data) return;

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
        _id: data._id || data.notificationId,
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

      // Add to notifications list (avoiding exact ID duplicate)
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === newNotif.id);
        if (exists) return prev;
        return [newNotif, ...prev];
      });

      // Show toast
      setActiveToasts((prev) => [newNotif, ...prev.slice(0, 3)]);

      // Auto dismiss toast after 6 seconds
      setTimeout(() => {
        dismissToast(newNotif.id);
      }, 6000);

      // Play sound
      playNotificationSound();
    },
    [dismissToast]
  );

  // Setup Socket.IO listener
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => {
      setStatus("connected");
      // Join default common room and admin room
      socket.emit("join_room", "admin_dashboard");
      socket.emit("join_room", "ADMIN");
      // Check if user session exists in cookie or localStorage
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          joinUserRooms(user);
        }
      } catch {
        // ignore
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
      "ORDER_SHIPPED",
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

    // Connect socket
    if (!socket.connected) {
      socket.connect();
    } else {
      setStatus("connected");
    }

    // Attempt to sync notifications from backend API if available
    const syncWithBackend = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/v1/notifications?limit=30", {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: TNotification[] = json.data.map((item: any) => {
              const msg = item.message || "";
              let title = "New Notification";
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

            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const fresh = mapped.filter((m) => !existingIds.has(m.id));
              return [...prev, ...fresh];
            });
          }
        }
      } catch {
        // ignore fetch failure if unauthenticated or server offline
      }
    };

    syncWithBackend();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("notification");
      specificEvents.forEach((evt) => socket.off(evt));
    };
  }, [handleIncomingNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const sendTestNotification = useCallback(
    (overrides?: Partial<TNotification>) => {
      const types = [
        "NEW_ORDER",
        "payment_success",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",
        "NEW_ACCOUNT",
      ];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const sampleId = Math.floor(1000 + Math.random() * 9000);

      const mockPayload = {
        notificationId: `test-${Date.now()}`,
        type: overrides?.type || randomType,
        message:
          overrides?.message ||
          `Real-time test alert for Order #AZ-${sampleId} received at ${new Date().toLocaleTimeString()}.`,
        createdAt: new Date().toISOString(),
        ...overrides,
      };

      handleIncomingNotification(mockPayload, mockPayload.type);
    },
    [handleIncomingNotification]
  );

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
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        dismissToast,
        sendTestNotification,
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
    case "PAYMENT_SUCCESS":
      return "Payment Succeeded";
    case "PAYMENT_FAILED":
      return "Payment Issue";
    case "NEW_ACCOUNT":
      return "New Account Created";
    case "SLA_WARNING":
      return "SLA Performance Warning";
    case "FRAUD_ALERT":
      return "Fraud Detection Alert";
    default:
      return "System Notification";
  }
}
