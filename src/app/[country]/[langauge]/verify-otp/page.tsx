"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface VerifyOTPProps {
  email?: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({
  email = "user@example.com",
  onVerify,
  onResend,
  onBack,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic for resend button
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp.join(""));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F4F1] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#FFF9EE]">
        {/* Header Section */}
        <div className="bg-[#0B5D4E] p-6 text-center">
          <div className="inline-flex p-3 rounded-full bg-[#E8F4F1] mb-4">
            <ShieldCheck className="w-8 h-8 text-[#0B5D4E]" />
          </div>
          <h2 className="text-2xl font-bold text-[#E8F4F1]">Verify OTP</h2>
          <p className="text-[#E8F4F1]/80 text-sm mt-2">
            We sent a verification code to <br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-between gap-2 mb-8" dir="ltr">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold text-[#0B5D4E] bg-[#E8F4F1] border-transparent focus:border-[#0B5D4E] focus:ring-0 transition-all outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some((v) => v === "")}
            className="w-full py-4 bg-[#0B5D4E] text-[#E8F4F1] font-bold rounded-xl hover:bg-[#084838] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Verify & Proceed
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Didn't receive the code?{" "}
              {timer > 0 ? (
                <span className="text-[#0B5D4E] font-bold">
                  Resend in {timer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTimer(30);
                    onResend();
                  }}
                  className="text-[#0B5D4E] font-bold hover:underline"
                >
                  Resend Now
                </button>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-8 flex items-center justify-center w-full text-gray-500 hover:text-[#0B5D4E] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
