"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Samarix AI assistant. How can I help you find the best food today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm currently a demo version. I can't process real orders yet, but I think you'd love our sushi selection!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-[350px] md:w-[380px] h-[500px] max-h-[80vh] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-bg to-teal-600 p-4 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Samarix AI</h3>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                    <span className="text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "bg-emerald-bg text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex items-center gap-1.5 mb-1 text-xs text-emerald-bg font-semibold">
                        <Sparkles size={10} />
                        AI Assistant
                      </div>
                    )}
                    {msg.text}
                    <div
                      className={`text-[10px] mt-1 ${
                        msg.sender === "user"
                          ? "text-emerald-100"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-gray-100"
            >
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2 bg-emerald-bg text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">
                  Powered by Jayak Hub Models
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`pointer-events-auto p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? "bg-gray-800 text-white rotate-90"
            : "bg-gradient-to-r from-emerald-bg to-teal-600 text-white animate-bounce-subtle"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
}
