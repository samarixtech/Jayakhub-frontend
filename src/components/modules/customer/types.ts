// Enum for Order Status
export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PREPARE = "prepare",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_of_delivery",
  DELIVERED = "delivered",
  REJECTED = "rejected",
}

export interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  image: string;
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
}

export interface OrderSummary {
  totalSpend: string;
  totalOrdersCount: number;
  totalPendingOrders: number;
}
