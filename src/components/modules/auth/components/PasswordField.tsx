"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  placeholder?: string;
  field: any;
  error?: boolean;
  compact?: boolean;
}

export function PasswordField({
  placeholder = "Password",
  field,
  error,
  compact,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={cn(
          "pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg transition-all",
          compact ? "h-12" : "h-13",
          error &&
            "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500",
        )}
        {...field}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-bg"
        tabIndex={-1}
      >
        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
}
