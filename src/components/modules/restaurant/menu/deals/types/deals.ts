export interface MenuItemOption {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
}

export interface DealItemSelection {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  category: string;
  image?: string;
}

export interface DealCombo {
  id: string;
  title: string;
  tagline: string;
  description: string;
  dealType: "flash" | "weekend" | "seasonal" | "combo" | "special" | "spcial";
  status: "active" | "inactive" | "scheduled" | "expired";
  image: string;
  items: DealItemSelection[];
  originalPrice: number;
  comboPrice: number;
  discountAmount: number;
  discountPercentage: number;
  schedule: string;
  badge?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  discountType?: "percentage" | "fixed";
}

export const DEAL_TYPE_OPTIONS: {
  value: DealCombo["dealType"];
  label: string;
}[] = [
  { value: "flash", label: "Flash Sale" },
  { value: "weekend", label: "Weekend Deal" },
  { value: "seasonal", label: "Seasonal Offer" },
  { value: "combo", label: "Combo Meal" },
  { value: "special", label: "Special Offer" },
];
