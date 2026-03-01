import { useEffect, useState } from "react";
import { getMyCardsAction } from "@/app/actions/customer/userprofile";

export function usePaymentMethods() {
  const [defaultCard, setDefaultCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefaultCard = async () => {
      const result = await getMyCardsAction();
      if (result.success && result.data) {
        // FIND DEFAULT CARD
        const foundDefault = result.data.find(
          (card: any) => card.isDefault === true,
        );
        setDefaultCard(foundDefault);
      }
      setLoading(false);
    };

    fetchDefaultCard();
  }, []);

  return {
    defaultCard,
    loading,
  };
}
