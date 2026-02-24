export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  reply: string | null;
  orderId: string;
  createdAt: string;
  customerMetrics: {
    totalOrders: number;
    averageSpend: number;
  } | null;
}
