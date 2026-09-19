import { io, Socket } from "socket.io-client";
import { store } from "../redux/store";

let socket: Socket | null = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:9000";

export type TSocketResponse<T = any> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const state = store?.getState?.();
    if (state?.auth?.token) {
      return state.auth.token;
    }
    const persisted = localStorage.getItem("persist:auth");
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (parsed?.token) {
        return typeof parsed.token === "string" && parsed.token.startsWith('"')
          ? JSON.parse(parsed.token)
          : parsed.token;
      }
    }
  } catch {}
  return null;
};

export const getSocket = (explicitToken?: string): Socket => {
  if (typeof window === "undefined") {
    // Return dummy object if executed on server
    return {} as Socket;
  }

  const token = explicitToken || getStoredToken();

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: token ? { token } : undefined,
    });
  } else if (token) {
    socket.auth = { token };
  }

  return socket;
};

export const authenticateSocket = (
  token?: string,
  user?: { _id?: string; id?: string; email?: string; role?: string } | null
): Promise<boolean> => {
  const currentSocket = getSocket(token);
  if (!currentSocket) return Promise.resolve(false);

  const authToken = token || getStoredToken();
  const userId = user?._id || user?.id;
  const userEmail = user?.email;

  return new Promise((resolve) => {
    const doAuth = () => {
      currentSocket.emit(
        "authenticate",
        { token: authToken, userId, userEmail },
        (res: TSocketResponse) => {
          if (res?.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    };

    if (currentSocket.connected) {
      doAuth();
    } else {
      currentSocket.connect();
      currentSocket.once("connect", () => {
        doAuth();
      });
    }
  });
};

export const emitSocketWithAck = <T = any>(
  event: string,
  data: any = {}
): Promise<TSocketResponse<T>> => {
  return new Promise((resolve, reject) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
      return reject(new Error("Socket is not initialized"));
    }

    const payload = { ...data };
    const token = getStoredToken();
    if (token && !payload.token) {
      payload.token = token;
    }

    let isDone = false;
    const timer = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        reject(new Error(`Socket request '${event}' timed out`));
      }
    }, 12000);

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
      currentSocket.once("connect", () => {
        executeEmit();
      });
    }
  });
};

export const joinRoom = (roomName: string) => {
  const currentSocket = getSocket();
  if (currentSocket && roomName) {
    if (currentSocket.connected) {
      currentSocket.emit("join_room", roomName);
    } else {
      currentSocket.connect();
      currentSocket.once("connect", () => {
        currentSocket.emit("join_room", roomName);
      });
    }
  }
};

export const leaveRoom = (roomName: string) => {
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected && roomName) {
    currentSocket.emit("leave_room", roomName);
  }
};

export const joinConversationRoom = (conversationId: string) => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  if (!currentSocket) return;

  const payload = { conversationId };

  if (currentSocket.connected) {
    currentSocket.emit("join_conversation", payload);
  } else {
    currentSocket.connect();
    currentSocket.once("connect", () => {
      currentSocket.emit("join_conversation", payload);
    });
  }
};

export const leaveConversationRoom = (conversationId: string) => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit("leave_conversation", { conversationId });
  }
};

export const emitTyping = (conversationId: string) => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit("typing", { conversationId });
  }
};

export const emitStopTyping = (conversationId: string) => {
  if (!conversationId) return;
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit("stop_typing", { conversationId });
  }
};

export const joinUserRooms = (
  user?: { _id?: string; id?: string; role?: string } | null
) => {
  if (!user) return;
  const currentSocket = getSocket();
  if (!currentSocket) return;

  const userId = user._id || user.id;
  const role = user.role?.toUpperCase();

  if (userId) {
    joinRoom(`user:${userId}`);
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    joinRoom("admin_dashboard");
  } else if (role === "VENDOR" && userId) {
    joinRoom(`vendor:${userId}`);
  } else if (role === "CUSTOMER" && userId) {
    joinRoom(`customer:${userId}`);
  }
};
