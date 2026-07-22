"use client";

import { io, Socket } from "socket.io-client";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "";
const SOCKET_URL = (() => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return API_BASE;
  }
})();

let socket: Socket | null = null;

/**
 * Get or create the singleton socket connection.
 * @param token - The auth token (from cookie) to authenticate the handshake.
 */
export const getSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      transports: ["polling", "websocket"],
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {});

    socket.on("connect_error", (err) => {
      console.error("❌ [SOCKET] Connection Error:", err.message);
    });

    socket.on("disconnect", (reason) => {});
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
