"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GlobalModal } from "./GlobalModal";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isDeleting?: boolean;
  trigger?: React.ReactNode;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isDeleting = false,
  trigger,
}: DeleteConfirmationModalProps) {
  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      trigger={trigger}
      isOutsideDisabled={true}
    >
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
          className="hover:bg-zinc-100 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 cursor-pointer min-w-[90px]"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </GlobalModal>
  );
}
