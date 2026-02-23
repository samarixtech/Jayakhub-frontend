export interface ReviewItem {
    id: string;
    author: string;
    avatar: string;
    time: string;
    orderId: string;
    rating: number;
    text: string;
    replied: boolean;
    reply: {
        time: string;
        text: string;
    } | null;
    history: string;
    avgSpend: string;
}

export const MOCK_REVIEWS_DATA: ReviewItem[] = [
    {
        id: "1",
        author: "Sarah Jenkins",
        avatar: "https://i.pravatar.cc/150?img=47",
        time: "2 hours ago",
        orderId: "#1254",
        rating: 5,
        text: "The food was absolutely delicious! The delivery was also very fast. Will definitely order again.",
        replied: false,
        reply: null,
        history: "12 lifetime orders",
        avgSpend: "$24.50"
    },
    {
        id: "2",
        author: "Mike Thompson",
        avatar: "https://i.pravatar.cc/150?img=11",
        time: "Yesterday",
        orderId: "#1102",
        rating: 3,
        text: "Burger was cold when it arrived. Fries were soggy. Not happy.",
        replied: true,
        reply: {
            time: "Yesterday",
            text: "Hi Mike, we are so sorry to hear this. Please contact us at support@example.com so we can make it right with a refund or replacement."
        },
        history: "3 lifetime orders",
        avgSpend: "$18.00"
    },
    {
        id: "3",
        author: "Aisha Al-Hashim",
        avatar: "https://i.pravatar.cc/150?img=33",
        time: "2 days ago",
        orderId: "#1089",
        rating: 5,
        text: "Always hits the spot! The new spicy chicken sandwich is incredible. Keep it up guys.",
        replied: false,
        reply: null,
        history: "8 lifetime orders",
        avgSpend: "$32.00"
    }
];
