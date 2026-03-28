"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/components/services/socket";
import { toast } from "react-hot-toast";
import { Receipt } from "lucide-react";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // console.log("🚀 [SOCKET PROVIDER] Mounted — initializing socket...");
    // console.log("🔑 [SOCKET PROVIDER] Token present:", !!token);
    if (!token) {
      console.warn(
        "⚠️ [SOCKET] No auth token found, skipping socket connection.",
      );
      return;
    }

    const socket = getSocket(token);
    socketRef.current = socket;
    // console.log(
    //   "📡 [SOCKET PROVIDER] Socket state:",
    //   socket.connected ? "CONNECTED" : "CONNECTING...",
    // );

    // 🔍 DEBUG: Log ALL incoming events from server
    socket.onAny((eventName: string, ...args: any[]) => {
      // console.log(`📨 [SOCKET EVENT] "${eventName}"`, ...args);
    });

    // Listen for HANDSHAKE_SUCCESS
    socket.on("HANDSHAKE_SUCCESS", (data: any) => {
      console.log("✅ [SOCKET] Handshake success:", data);
    });

    // 🔔 Listen for NEW_ORDER_RECEIVED globally
    socket.on("NEW_ORDER_RECEIVED", (data: any) => {
      // console.log("🔔 [SOCKET] New Order Received:", data);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-sm w-full bg-emerald-600 shadow-xl rounded-xl pointer-events-auto flex ring-1 ring-emerald-700/30 overflow-hidden`}
          >
            <div className="flex-1 p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">
                    🔔 New Order!
                  </p>
                  <p className="mt-0.5 text-sm text-emerald-100">
                    {data.customerName || "Customer"} placed an order
                  </p>
                  <p className="text-xs text-emerald-200 mt-1">
                    Rs. {data.totalPrice} • {data.itemsCount} item(s)
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-emerald-500">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        ),
        { duration: 6000, position: "top-right" },
      );
    });

    return () => {
      socket.off("HANDSHAKE_SUCCESS");
      socket.off("NEW_ORDER_RECEIVED");
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}
