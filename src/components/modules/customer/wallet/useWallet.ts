import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  deleteCardAction,
  getMyCardsAction,
} from "@/app/actions/customer/userprofile";

export function useWallet() {
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

  return {
    cards,
    isLoading,
    isDeleting,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedCard,
    openDeleteConfirm,
    handleDelete,
  };
}
