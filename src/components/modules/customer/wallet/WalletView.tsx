"use client";
import { Plus, Trash2, Edit2, Loader2, AlertTriangle } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobalModal } from "@/components/common/GlobalModal";
import { useState, useEffect } from "react";
import { AddCardForm } from "./add-card-form";
import {
  deleteCardAction,
  getMyCardsAction,
} from "@/app/actions/customer/userprofile";
import toast from "react-hot-toast";

// Helper: Dynamic Card Styling based on Brand
const getCardStyles = (type: string) => {
  const brand = type?.toLowerCase();
  switch (brand) {
    case "visa":
      return "bg-gradient-to-br from-[#1a1f71] to-[#070928]";
    case "mastercard":
      return "bg-gradient-to-br from-[#2b2b2b] via-[#202020] to-[#eb001b]";
    case "diners-club":
      return "bg-gradient-to-br from-[#004a97] to-[#007ad4]";
    default:
      return "bg-gradient-to-br from-gray-700 to-gray-900";
  }
};

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
      {type || "Unknown"}
    </span>
  );
};

const EmvChip = () => (
  <div className="h-8 w-11 rounded-md bg-linear-to-br from-yellow-100/50 to-yellow-400/50 border border-white/20 relative overflow-hidden flex flex-col justify-between py-1 px-1">
    <div className="w-full h-px bg-black/20" />
    <div className="w-full h-px bg-black/20" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-black/20" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-5 border border-black/20 rounded-sm" />
  </div>
);

export default function WalletView() {
  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Data States
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCards = async () => {
    setIsLoading(true);
    const result = await getMyCardsAction();
    if (result.success) setCards(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // --- Form Handlers ---
  const handleEdit = (card: any) => {
    setSelectedCard(card);
    setIsFormModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCard(null);
    setIsFormModalOpen(true);
  };

  // --- Delete Handlers ---
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

  return (
    <div className="space-y-8">
      {/* HEADER & ADD CARD MODAL */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pr-10">
        <div>
          <Typography
            variant="h2"
            className="text-2xl font-black text-gray-900"
          >
            Payment Methods
          </Typography>
          <Typography variant="p" className="text-gray-500 text-sm mt-1">
            Manage your stored payment cards
          </Typography>
        </div>

        <GlobalModal
          open={isFormModalOpen}
          onOpenChange={setIsFormModalOpen}
          title={
            selectedCard ? "Edit Payment Method" : "Add New Payment Method"
          }
          trigger={
            <Button
              onClick={handleAdd}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full py-6 px-8 font-bold flex gap-2"
            >
              <Plus size={20} /> Add New Card
            </Button>
          }
        >
          <AddCardForm
            card={selectedCard}
            onSuccess={() => {
              setIsFormModalOpen(false);
              fetchCards();
            }}
            onCancel={() => setIsFormModalOpen(false)}
          />
        </GlobalModal>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <GlobalModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Remove Card"
        description="Are you sure you want to remove this card? This action cannot be undone."
        trigger={<span className="hidden" />} // Controlled modal, trigger not needed visually
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full h-14 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Yes, Remove Card"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="w-full h-12 rounded-full text-gray-500 font-bold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </GlobalModal>

      {/* CARDS LISTING */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : (
        <div className="flex flex-wrap gap-10">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className="space-y-6 w-full max-w-[380px]">
                {/* Visual Card Component */}
                <div
                  className={`relative aspect-[1.586/1] w-full rounded-2xl p-6 text-white shadow-xl ${getCardStyles(
                    card.cardType,
                  )} flex flex-col justify-between overflow-hidden group`}
                >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                  <div className="flex justify-between items-start relative z-10">
                    <EmvChip />
                    {card.isDefault && (
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md font-light tracking-wider px-3 py-1 text-sm">
                        DEFAULT
                      </Badge>
                    )}
                  </div>
                  <div className="relative z-10 mt-2">
                    <div className="flex items-center gap-3 text-xl sm:text-2xl font-mono tracking-widest opacity-90">
                      <span>****</span>
                      <span>****</span>
                      <span>****</span>
                      <span>{card.cardNumber.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-[8px] font-bold text-white/60 tracking-widest uppercase mb-0.5">
                          Card Holder
                        </p>
                        <p className="font-bold tracking-widest text-xs uppercase line-clamp-1">
                          {card.cardholderName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-white/60 tracking-widest uppercase mb-0.5">
                          Expires
                        </p>
                        <p className="font-bold tracking-widest text-xs">
                          {card.expiryDate}
                        </p>
                      </div>
                    </div>
                    <CardLogo type={card.cardType} />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleEdit(card)}
                    variant="outline"
                    className="flex-1 rounded-xl h-10 border-gray-100 bg-white font-bold text-xs shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                  </Button>
                  <Button
                    onClick={() => openDeleteConfirm(card)}
                    variant="ghost"
                    className="flex-1 rounded-xl h-10 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <Typography className="text-gray-400">
                No payment methods found.
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
