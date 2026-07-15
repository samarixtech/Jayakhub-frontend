"use client";

import { useTransition, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth/auth";
import { getPOSDashboardAction } from "@/app/actions/restaurant/pos";
import { exportToPDF } from "@/lib/utils/pdfs/pdf-export";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface UseCloseRegisterOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function useCloseRegister({
  open,
  onOpenChange,
}: UseCloseRegisterOptions) {
  const t = useTranslations("POS.closeRegister.toasts");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        const res = await getPOSDashboardAction();
        if (res.success) {
          setData(res.data);
        } else {
          toast.error(t("loadFailed"));
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [open]);

  const handleCloseShift = () => {
    if (!pdfRef.current || !data) return;

    startTransition(async () => {
      await exportToPDF({
        element: pdfRef.current,
        filename: `POS-Shift-Report-${new Date().toISOString().split("T")[0]}.pdf`,
        onSuccess: async () => {
          if (data.user?.role === "cashier") {
            try {
              const res = await logoutAction();
              if (res.success) {
                toast.success(t("closedLoggedOut"));
                onOpenChange(false);
                router.replace("/login");
              } else {
                toast.error(res.message || t("closeFailed"));
              }
            } catch (error) {
              toast.error(t("logoutError"));
            }
          } else {
            toast.success(t("closedReport"));
            onOpenChange(false);
            router.replace("/restaurant/dashboard");
          }
        },
      });
    });
  };

  return {
    data,
    isLoading,
    isPending,
    pdfRef,
    handleCloseShift,
  };
}
