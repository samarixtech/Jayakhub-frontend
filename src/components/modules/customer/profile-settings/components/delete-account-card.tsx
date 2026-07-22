"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { deleteAccountAction } from "@/app/actions/auth/auth";
import { useTranslations } from "next-intl";

export default function DeleteAccountCard() {
  const t = useTranslations("CustomerDashboard.ProfileSettings");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { execute, isPending } = useServerAction(deleteAccountAction, {
    onSuccess: () => {
      sessionStorage.clear();
      setIsModalOpen(false);
      router.push("/login");
    },
  });

  const handleDelete = () => {
    execute();
  };

  return (
    <>
      <Card className="rounded-3xl p-4 border border-red-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-bold text-gray-900">
            {t("delete_account_title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            {t("delete_account_description")}
          </p>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 px-6 h-11 font-semibold transition-all"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("delete_account_button")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border-none shadow-2xl p-0 overflow-hidden">
          <div className="flex flex-col items-center pt-8 pb-4 px-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {t("delete_modal_title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 leading-relaxed max-w-sm">
                {t("delete_modal_description")}
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-2 bg-white">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="rounded-full h-12 flex-1 font-semibold border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              {t("delete_modal_cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full h-12 flex-1 font-semibold bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20 transition-all"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isPending
                ? t("delete_modal_deleting")
                : t("delete_modal_confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
