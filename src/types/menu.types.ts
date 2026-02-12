export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;
  category?: string;
  isAvailable?: boolean;
  variations?: any[];
  basePrice?: number;
}

export interface CartItem extends MenuItem {
  cartId?: string;
  quantity: number;
  productId?: string;
  selectedVariations?: any[];
  restaurantName?: string;
  restaurantId?: string;
  totalPrice?: number;
}

export interface SimilarRestaurant {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: string[];
  promoText?: string;
}

export interface BulkImportItem {
  name: string;
  description: string;
  category: string;
  dietaryType: string;
  basePrice: number;
  isAvailable: boolean;
  variations: {
    groupName: string;
    options: { name: string; price: number }[];
  }[];
  itemImage?: string;
}
