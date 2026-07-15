// Enum for Order Status
export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PREPARE = "prepare",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_of_delivery",
  DELIVERED = "delivered",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  RIDER_NOT_ASSIGNED = "rider_not_assigned",
}

export interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  image: string;
  id?: string;
  originalId?: string | null;
  orderItemId?: string | null;
  rate?: number;
  comment?: string;
  reply?: string;
  selectedVariations?: unknown[];
}

export interface PaymentDetails {
  cardNumber: string;
  cardType: string;
  ownerName: string;
}

export interface Order {
  orderId: string;
  totalAmount: string;
  OrderStatus: string;
  paymentMethod: string;
  orderDate: string;
  orderTime: string;
  paymentDetails: PaymentDetails;
  items: OrderItem[];
  restaurantId?: string;
  restaurantName?: string;
}

export interface OrderSummary {
  totalSpend: string;
  totalOrdersCount: number;
  totalPendingOrders: number;
  averageRating: string | number;
}
