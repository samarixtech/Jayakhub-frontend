"use client";
import { useState, useEffect } from "react";
import { Trash2, Loader2, AlertTriangle, CreditCard, Plus, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalModal } from "@/components/common/GlobalModal";
import { WalletSkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";

import {
  deleteCardAction,
  getMyCardsAction,
} from "@/app/actions/customer/userprofile";


// CARD STYLES (COLORS)
const getCardStyles = (type: string) => {
  const brand = type?.toLowerCase();
  switch (brand) {
    case "visa":
      return "bg-linear-to-br from-[#1a1f71] to-[#070928]";
    case "mastercard":
      return "bg-linear-to-br from-[#2b2b2b] via-[#202020] to-[#eb001b]";
    case "diners-club":
      return "bg-linear-to-br from-[#004a97] to-[#007ad4]";
    case "amex":
      return "bg-linear-to-br from-[#2E7D32] to-[#1B5E20]";
    default:
      return "bg-linear-to-br from-gray-700 to-gray-900";
  }
};

// CARD LOGO
const CardLogo = ({ type }: { type: string }) => {
  const brand = type?.toLowerCase();
  if (brand === "visa")
    return (
      <span className="text-white font-black italic text-xl tracking-tighter">
        VISA
      </span>
    );
  if (brand === "mastercard")
    return (
      <div className="flex items-center">
        <div className="h-6 w-6 rounded-full bg-red-600/90 mix-blend-screen" />
        <div className="h-6 w-6 rounded-full bg-yellow-500/90 mix-blend-screen -ml-2.5" />
      </div>
    );
  return (
    <span className="text-white/80 font-bold uppercase text-[10px] tracking-widest">
      {type || "Card"}
    </span>
  );
};

const EmvChip = () => (
  <div className="h-8 w-11 rounded-md bg-linear-to-br from-yellow-100/50 to-yellow-400/50 border border-white/20 relative overflow-hidden flex flex-col justify-between py-1 px-1 shadow-sm">
    <div className="w-full h-px bg-black/20" />
    <div className="w-full h-px bg-black/20" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-black/20" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-5 border border-black/20 rounded-sm" />
  </div>
);

// PAYMENT CARD COMPONENT
const PaymentCard = ({
  card,
  onDelete,
}: {
  card: any;
  onDelete: (card: any) => void;
}) => {
  return (
    <div className="space-y-4 w-full max-w-[380px] group">
      {/* Visual Card */}
      <div
        className={`relative aspect-[1.586/1] w-full rounded-2xl p-6 text-white shadow-xl transition-transform duration-300 hover:scale-[1.02] ${getCardStyles(
          card.cardType,
        )} flex flex-col justify-between overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start relative z-10">
          <EmvChip />
          {card.isDefault && (
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md font-medium tracking-wider px-2 py-0.5 text-[10px] shadow-sm">
              DEFAULT
            </Badge>
          )}
        </div>

        {/* Number */}
        <div className="relative z-10 mt-4">
          <div className="flex items-center gap-3 text-xl sm:text-2xl font-mono tracking-widest opacity-90 drop-shadow-md">
            <span>••••</span>
            <span>••••</span>
            <span>••••</span>
            <span>{card.last4 || "0000"}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end relative z-10">
          <div className="flex gap-6">
            <div>
              <p className="text-[8px] font-bold text-white/70 tracking-widest uppercase mb-0.5">
                Card Holder
              </p>
              <p className="font-bold tracking-widest text-xs uppercase line-clamp-1 max-w-[120px]">
                {card.cardholderName || "NAME"}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-white/70 tracking-widest uppercase mb-0.5">
                Expires
              </p>
              <p className="font-bold tracking-widest text-xs">
                {card.expiryDate || "MM/YY"}
              </p>
            </div>
          </div>
          <CardLogo type={card.cardType} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          onClick={() => onDelete(card)}
          variant="ghost"
          size="sm"
          className="flex-1 rounded-xl h-9 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
        </Button>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <CreditCard className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">No cards added</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
      Please make a order so your card will automatically be saved .
    </p>
  </div>
);

// MAIN COMPONENT
export default function WalletView() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // FETCH CARDS
  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const result = await getMyCardsAction();
      if (result.success) {
        setCards(result.data || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch cards");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const openDeleteConfirm = (card: any) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCard) return;

    setIsDeleting(true);
    const result = await deleteCardAction(selectedCard.id);

    if (result.success) {
      toast.success(result.message);
      setIsDeleteModalOpen(false);
      fetchCards();
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return <WalletSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-4 md:p-6 transition-all">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Typography
              variant="h2"
              className="text-2xl font-black text-gray-900"
            >
              Wallet
            </Typography>
            <Typography variant="p" className="text-gray-500 text-sm mt-1">
              Manage your payment methods and billing information.
            </Typography>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          title="Remove Payment Method"
          description="Are you sure you want to remove this card? This action cannot be undone."
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
                    Removing...
                  </>
                ) : (
                  "Yes, Remove Card"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-full h-12 rounded-xl text-gray-500 font-bold hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </GlobalModal>
      </div>
    </div>
  );
}
