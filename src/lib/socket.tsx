/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { store } from "@/redux/store";

/**
 * Socket Server URL from environment variables or fallback to localhost:8000
 */
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

/**
 * Standard server response format for Socket.IO ack callbacks
 */
export type TSocketResponse<T = any> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

/**
 * Common Real-Time Socket Events matching backend configurations
 */
export const SOCKET_EVENTS = {
  // Connection Events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  RECONNECT: "reconnect",

  // General Room & Auth Events
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  AUTHENTICATE: "authenticate",
  JOIN_ADMIN: "join_admin",
  NOTIFICATION: "notification",

  // Admin & System Events
  ADMIN_ROOM: "ADMIN",
  FRAUD_ALERT_CREATED: "fraudAlertCreated",
  FRAUD_ALERT_UPDATED: "fraudAlertUpdated",
  FRAUD_STATUS_CHANGED: "fraudStatusChanged",
  FRAUD_RESOLVED: "fraudResolved",

  // SLA & Vendor Events
  SLA_WARNING: "sla-warning",
  SLA_SUSPENDED: "sla-suspended",
  SLA_RESOLVED: "sla-resolved",

  // Commerce & Catalog Events
  BUY_BOX_UPDATED: "buy-box-updated",
  BEST_SELLER_UPDATED: "best-seller-updated",
  CATEGORY_BEST_SELLER_UPDATED: "category-best-seller-updated",

  // Chat & Messaging Events
  CREATE_CONVERSATION: "createConversation",
  GET_USER_CONVERSATIONS: "getUserConversations",
  GET_CONVERSATIONS: "getConversations",
  ARCHIVE_CONVERSATION: "archiveConversation",
  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",
  SEND_MESSAGE: "sendMessage",
  RECEIVE_MESSAGE: "receiveMessage",
  GET_CONVERSATION_MESSAGES: "getConversationMessages",
  GET_MESSAGES: "getMessages",
  MARK_MESSAGES_AS_READ: "markMessagesAsRead",
  DELETE_MESSAGE: "deleteMessage",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",
  USER_TYPING: "userTyping",
  USER_STOPPED_TYPING: "userStoppedTyping",
  NEW_NOTIFICATION: "newNotification",
} as const;

let socketInstance: Socket | null = null;

/**
 * Retrieve auth token from Redux state, Cookies, or persisted localStorage
 */
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    // 1. Check in-memory Redux store
    const state = store?.getState?.();
    if (state?.auth?.token) {
      return state.auth.token;
    }

    // 2. Check cookies
    const cookieToken = Cookies.get("accessToken");
    if (cookieToken) {
      return cookieToken;
    }

    // 3. Check persisted Redux store in localStorage
    const persisted = localStorage.getItem("persist:auth");
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (parsed?.token) {
        return typeof parsed.token === "string" && parsed.token.startsWith('"')
          ? JSON.parse(parsed.token)
          : parsed.token;
      }
    }
  } catch {
    // Suppress storage or JSON parsing errors
  }

  return null;
};

/**
 * Retrieve or initialize the singleton Socket.io client instance.
 * SSR-safe: returns a non-connecting stub on the server.
 */
export const getSocket = (explicitToken?: string): Socket => {
  if (typeof window === "undefined") {
    return io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  const token = explicitToken || getStoredToken();

  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1200,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: token ? { token } : undefined,
    });

    socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
      console.log(
        `%c[Socket] Connected to server: ${SOCKET_URL} (ID: ${socketInstance?.id})`,
        "color: #10b981; font-weight: bold;"
      );
    });

    socketInstance.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log(
        `%c[Socket] Disconnected from server: ${reason}`,
        "color: #f59e0b; font-weight: bold;"
      );
    });

    socketInstance.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.warn(`[Socket] Connection error:`, error.message);
    });
  } else if (token) {
    socketInstance.auth = { token };
  }

  return socketInstance;
};

/**
 * Connect socket manually with an optional auth token.
 */
export const connectSocket = (token?: string): Socket => {
  const s = getSocket(token);
  const authToken = token || getStoredToken();

  if (authToken) {
    s.auth = { token: authToken };
  }

  if (!s.connected) {
    s.connect();
  }

  return s;
};

/**
 * Disconnect the socket client cleanly.
 */
export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
  }
};

/**
 * Authenticate socket connection with token and optional user details.
 * Matches backend `socket.on("authenticate", ...)` returning a Promise<boolean>.
 */
export const authenticateSocket = (
  token?: string,
  user?: { _id?: string; id?: string; email?: string; role?: string } | null
): Promise<boolean> => {
  const currentSocket = getSocket(token);
  if (!currentSocket) return Promise.resolve(false);

  const authToken = token || getStoredToken();
  const userId = user?._id || user?.id;
  const userEmail = user?.email;

  if (authToken) {
    currentSocket.auth = { token: authToken };
  }

  return new Promise<boolean>((resolve) => {
    const doAuth = () => {
      currentSocket.emit(
        SOCKET_EVENTS.AUTHENTICATE,
        { token: authToken, userId, userEmail },
        (res: TSocketResponse) => {
          resolve(Boolean(res?.success));
        }
      );
    };

    if (currentSocket.connected) {
      doAuth();
    } else {
      currentSocket.connect();
      currentSocket.once(SOCKET_EVENTS.CONNECT, () => {
        doAuth();
      });
    }
  });
};

/**
 * Emit an event and wait for server acknowledgement with timeout.
 * Ideal for RTK Query custom queries/mutations (e.g. chatApi).
 */
export const emitSocketWithAck = <T = any>(
  event: string,
  data: any = {}
): Promise<TSocketResponse<T>> => {
  return new Promise<TSocketResponse<T>>((resolve, reject) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
      reject(new Error("Socket is not initialized"));
      return;
    }

    const payload: Record<string, any> = { ...data };
    const token = getStoredToken();
    if (token && !payload.token) {
      payload.token = token;
    }

    let isDone = false;
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        reject(new Error(`Socket request '${event}' timed out`));
      }
    }, 15000);

    const executeEmit = () => {
      currentSocket.emit(event, payload, (response: TSocketResponse<T>) => {
        if (!isDone) {
          isDone = true;
          clearTimeout(timer);
          resolve(response);
        }
      });
    };

    if (currentSocket.connected) {
      executeEmit();
    } else {
      currentSocket.connect();
      currentSocket.once(SOCKET_EVENTS.CONNECT, () => {
        executeEmit();
      });
    }
  });
};


export const joinRoom = (roomName: string): void => {
  if (!roomName) return;
  const currentSocket = getSocket();
  if (currentSocket.connected) {
    currentSocket.emit(SOCKET_EVENTS.JOIN_ROOM, roomName);
  } else {
    currentSocket.connect();
    currentSocket.once(SOCKET_EVENTS.CONNECT, () => {
      currentSocket.emit(SOCKET_EVENTS.JOIN_ROOM, roomName);
    });
  }
};



export const leaveRoom = (roomName: string): void => {
  if (!roomName) return;
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomName);
  }
};


export const joinConversationRoom = (conversationId: string): void => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  const payload = { conversationId };

  if (currentSocket.connected) {
    currentSocket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, payload);
  } else {
    currentSocket.connect();
    currentSocket.once(SOCKET_EVENTS.CONNECT, () => {
      currentSocket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, payload);
    });
  }
};


export const leaveConversationRoom = (conversationId: string): void => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
  }
};


export const emitTyping = (conversationId: string): void => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit(SOCKET_EVENTS.TYPING, { conversationId });
  }
};


export const emitStopTyping = (conversationId: string): void => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit(SOCKET_EVENTS.STOP_TYPING, { conversationId });
  }
};

export const joinUserRooms = (
  user?: { _id?: string; id?: string; role?: string } | null
): void => {
  if (!user) return;
  const userId = user._id || user.id;
  const role = user.role?.toUpperCase();

  if (userId) {
    joinRoom(userId);
    joinRoom(`user:${userId}`);
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    joinRoom(SOCKET_EVENTS.ADMIN_ROOM);
    // Emit join_admin for backend fraud alert handlers
    const currentSocket = getSocket();
    if (currentSocket.connected) {
      currentSocket.emit(SOCKET_EVENTS.JOIN_ADMIN);
    } else {
      currentSocket.once(SOCKET_EVENTS.CONNECT, () => {
        currentSocket.emit(SOCKET_EVENTS.JOIN_ADMIN);
      });
    }
  } else if (role === "VENDOR" && userId) {
    joinRoom(`vendor:${userId}`);
  } else if (role === "CUSTOMER" && userId) {
    joinRoom(`customer:${userId}`);
  }
};

export const socket: Socket = new Proxy({} as Socket, {
  get(_target, prop: string | symbol) {
    const s = getSocket();
    const value = (s as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(s);
    }
    return value;
  },
  set(_target, prop: string | symbol, value: unknown) {
    const s = getSocket();
    (s as unknown as Record<string | symbol, unknown>)[prop] = value;
    return true;
  },
});

/* =========================================================================
   React Context & Provider Implementation for UI Components
   ========================================================================= */

export interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  joinConversationRoom: (conversationId: string) => void;
  leaveConversationRoom: (conversationId: string) => void;
  emitTyping: (conversationId: string) => void;
  emitStopTyping: (conversationId: string) => void;
  connect: (token?: string) => Socket;
  disconnect: () => void;
  authenticate: (
    token?: string,
    user?: { _id?: string; id?: string; email?: string; role?: string } | null
  ) => Promise<boolean>;
  emitWithAck: <T = any>(event: string, data?: any) => Promise<TSocketResponse<T>>;
}

const SocketContext = createContext<ISocketContext | null>(null);

export interface SocketProviderProps {
  children: ReactNode;
  token?: string;
  autoConnect?: boolean;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  token,
  autoConnect = true,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentSocket, setCurrentSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = getSocket(token);
    setCurrentSocket(s);
    setIsConnected(s.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    s.on(SOCKET_EVENTS.CONNECT, handleConnect);
    s.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);

    if (autoConnect && !s.connected) {
      s.connect();
    }

    return () => {
      s.off(SOCKET_EVENTS.CONNECT, handleConnect);
      s.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    };
  }, [token, autoConnect]);

  const handleJoin = useCallback((room: string) => joinRoom(room), []);
  const handleLeave = useCallback((room: string) => leaveRoom(room), []);
  const handleJoinConversation = useCallback((convId: string) => joinConversationRoom(convId), []);
  const handleLeaveConversation = useCallback((convId: string) => leaveConversationRoom(convId), []);
  const handleEmitTyping = useCallback((convId: string) => emitTyping(convId), []);
  const handleEmitStopTyping = useCallback((convId: string) => emitStopTyping(convId), []);
  const handleConnect = useCallback((customToken?: string) => connectSocket(customToken), []);
  const handleDisconnect = useCallback(() => disconnectSocket(), []);
  const handleAuth = useCallback(
    (customToken?: string, user?: { _id?: string; id?: string; email?: string; role?: string } | null) =>
      authenticateSocket(customToken, user),
    []
  );
  const handleEmitWithAck = useCallback(
    <T = any>(event: string, data?: any) => emitSocketWithAck<T>(event, data),
    []
  );

  const contextValue = useMemo<ISocketContext>(
    () => ({
      socket: currentSocket,
      isConnected,
      joinRoom: handleJoin,
      leaveRoom: handleLeave,
      joinConversationRoom: handleJoinConversation,
      leaveConversationRoom: handleLeaveConversation,
      emitTyping: handleEmitTyping,
      emitStopTyping: handleEmitStopTyping,
      connect: handleConnect,
      disconnect: handleDisconnect,
      authenticate: handleAuth,
      emitWithAck: handleEmitWithAck,
    }),
    [
      currentSocket,
      isConnected,
      handleJoin,
      handleLeave,
      handleJoinConversation,
      handleLeaveConversation,
      handleEmitTyping,
      handleEmitStopTyping,
      handleConnect,
      handleDisconnect,
      handleAuth,
      handleEmitWithAck,
    ]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Custom React hook to consume socket context with graceful fallback.
 */
export const useSocket = (): ISocketContext => {
  const context = useContext(SocketContext);

  if (context) {
    return context;
  }

  const s = typeof window !== "undefined" ? getSocket() : null;

  return {
    socket: s,
    isConnected: s ? s.connected : false,
    joinRoom,
    leaveRoom,
    joinConversationRoom,
    leaveConversationRoom,
    emitTyping,
    emitStopTyping,
    connect: connectSocket,
    disconnect: disconnectSocket,
    authenticate: authenticateSocket,
    emitWithAck: emitSocketWithAck,
  };
};

export default socket;
