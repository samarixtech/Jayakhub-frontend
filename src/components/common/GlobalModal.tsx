"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GlobalModalProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GlobalModal({
  trigger,
  title,
  description,
  children,
  className,
  open,
  onOpenChange,
}: GlobalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[480px] rounded-3xl p-10 border-none shadow-2xl bg-white",
          className,
        )}
      >
        <DialogHeader className="text-left">
          {title && (
            <DialogTitle className="text-xl font-bold text-gray-900">
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription className="text-gray-500 text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
