"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import api from "./services/api";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  switchMode: (mode: "login" | "signup") => void;
  onLoginSuccess: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  switchMode,
  onLoginSuccess,
}: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const t = useTranslations("authModal");

  useEffect(() => {
    setEmail("");
    setPassword("");
    setPhone("");
    setLoading(false);
  }, [isOpen, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleSocialAuth = (provider: "google" | "apple") => {
    // Logic for Social Auth goes here (e.g., window.location.href = `${API_URL}/auth/${provider}`)
    toast.loading(`Connecting to ${provider}...`);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "signup") {
      const payload = { email, password, role: "user", phone };
      try {
        const response = await api.post("/auth/register", payload);
        toast.success("Registration successful! You can now log in.");
        switchMode("login");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Registration failed.");
      } finally {
        setLoading(false);
      }
    } else {
      const payload = { email, password, role: "user" };
      try {
        const response = await api.post("/auth/login", payload);
        const { accessToken, refreshToken, user }: any = response.user;
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome back, ${user.email || "User"}!`);
        onLoginSuccess();
        onClose();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Invalid credentials.");
      } finally {
        setLoading(false);
      }
    }
  };

  const title = mode === "login" ? t("welcome") : t("createAccount");
  const subtitle = mode === "login" ? t("continue") : t("freeDelivery");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-[#2C2C2C]/25 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              className="relative w-full max-w-md p-8 rounded-3xl bg-[#E8F4F1] shadow-2xl border border-white/20 overflow-y-auto max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
            >
              <button
                onClick={onClose}
                className="absolute right-5 top-5 p-2 rounded-full hover:bg-black/5 transition duration-200"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-[#0B5D4E]">
                  {title}
                </h2>
                <p className="text-gray-600 mt-2">{subtitle}</p>
              </div>

              {/* SOCIAL BUTTONS */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleSocialAuth("google")}
                  className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  <FcGoogle className="text-xl" /> Google
                </button>
                <button
                  onClick={() => handleSocialAuth("apple")}
                  className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-medium"
                >
                  <FaApple className="text-xl" /> Apple
                </button>
              </div>

              {/* SEPARATOR */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#E8F4F1] text-gray-500 uppercase">
                    Or with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
                />

                {mode === "signup" && (
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
                  />
                )}

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0B5D4E] text-white font-bold rounded-xl shadow-md hover:bg-[#084838] transition duration-300 text-lg disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "Log In"
                    : "Create Account"}
                </button>

                <p className="text-sm text-center text-gray-700 mt-4">
                  {mode === "login" ? (
                    <>
                      {t("newAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("signup")}
                        className="text-[#0B5D4E] font-semibold hover:underline"
                      >
                        {t("signup")}
                      </button>
                    </>
                  ) : (
                    <>
                      {t("existingAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="text-[#0B5D4E] font-semibold hover:underline"
                      >
                        {t("login")}
                      </button>
                    </>
                  )}
                </p>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
