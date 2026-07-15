"use client";
import { Loader2, AlertTriangle } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { GlobalModal } from "@/components/common/GlobalModal";
import { WalletSkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";

import { useWallet } from "./useWallet";
import { PaymentCard } from "./components/payment-card";
import { EmptyState } from "./components/empty-state";
import { useTranslations } from "next-intl";

export default function WalletView() {
  const t = useTranslations('CustomerDashboard.Wallet');
  const {
    cards,
    isLoading,
    isDeleting,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedCard,
    openDeleteConfirm,
    handleDelete,
  } = useWallet();

  if (isLoading) {
    return <WalletSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-4 md:p-6 transition-all">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Typography
              variant="h2"
              className="text-2xl font-black text-gray-900"
            >
              {t('title')}
            </Typography>
            <Typography variant="p" className="text-gray-500 text-sm mt-1">
              {t('subtitle')}
            </Typography>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {cards.length > 0 ? (
            cards.map((card) => (
              <PaymentCard
                key={card.id}
                card={card}
                onDelete={openDeleteConfirm}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* DELETE DIALOG */}
        <GlobalModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title={t('remove_payment_title')}
          description={t('remove_payment_desc')}
          trigger={<span className="hidden" />}
        >
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>

            <div className="w-full space-y-3">
              {selectedCard && (
                <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100 mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    {selectedCard.cardType}
                  </span>
                  <span className="text-sm font-mono font-medium text-gray-900">
                    •••• {selectedCard.cardNumber?.slice(-4)}
                  </span>
                </div>
              )}

              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-md shadow-red-500/20"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />{" "}
                    {t('removing')}
                  </>
                ) : (
                  t('yes_remove_card')
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-full h-12 rounded-xl text-gray-500 font-bold hover:bg-gray-50"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </GlobalModal>
      </div>
    </div>
  );
}
