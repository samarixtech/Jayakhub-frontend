export interface Ticket {
  id: string;
  restaurantId?: string;
  userId?: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  updatedAt: string;
}

export interface KBCategory {
  name: string;
  description: string;
  articles: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}
