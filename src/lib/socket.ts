import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:9000";

export const getSocket = (): Socket => {
  if (typeof window === "undefined") {
    // Return dummy object if executed on server
    return {} as Socket;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }

  return socket;
};

export const joinRoom = (roomName: string) => {
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected && roomName) {
    currentSocket.emit("join_room", roomName);
  }
};

export const leaveRoom = (roomName: string) => {
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected && roomName) {
    currentSocket.emit("leave_room", roomName);
  }
};

export const joinUserRooms = (user?: { _id?: string; id?: string; role?: string } | null) => {
  if (!user) return;
  const currentSocket = getSocket();
  if (!currentSocket || !currentSocket.connected) return;

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
