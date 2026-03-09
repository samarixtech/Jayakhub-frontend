import {
  ShoppingBag,
  CreditCard,
  Settings,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import type { KBCategory } from "../support.types";

const KB_CATEGORIES: KBCategory[] = [
  {
    name: "Getting Started",
    description: "Setup guide, onboarding, first steps",
    articles: 12,
    icon: <BookOpen className="w-[18px] h-[18px]" />,
    color: "text-[#346853]",
    bgColor: "bg-[#f2f8f6] border border-[#e8f3ef]",
  },
  {
    name: "Orders & Delivery",
    description: "Order flow, tracking, delivery",
    articles: 18,
    icon: <ShoppingBag className="w-[18px] h-[18px]" />,
    color: "text-[#3b82f6]",
    bgColor: "bg-[#eff6ff] border border-[#dbeafe]",
  },
  {
    name: "Payments & Billing",
    description: "Payouts, invoices, billing info",
    articles: 14,
    icon: <CreditCard className="w-[18px] h-[18px]" />,
    color: "text-[#f59e0b]",
    bgColor: "bg-[#fffbeb] border border-[#fef3c7]",
  },
  {
    name: "Menu Management",
    description: "Items, categories, variants, photos",
    articles: 21,
    icon: <BookOpen className="w-[18px] h-[18px]" />,
    color: "text-[#a855f7]",
    bgColor: "bg-[#faf5ff] border border-[#f3e8ff]",
  },
  {
    name: "Account & Settings",
    description: "Profile, team roles, notifications",
    articles: 9,
    icon: <Settings className="w-[18px] h-[18px]" />,
    color: "text-[#3b82f6]",
    bgColor: "bg-[#eff6ff] border border-[#dbeafe]",
  },
  {
    name: "Troubleshooting",
    description: "Common issues, error codes, fixes",
    articles: 16,
    icon: <AlertCircle className="w-[18px] h-[18px]" />,
    color: "text-[#ec4899]",
    bgColor: "bg-[#fdf2f8] border border-[#fce7f3]",
  },
];

export const KnowledgeBaseCategories = () => {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-[15px] font-bold text-[#1a1a1a]">Knowledge Base</h3>
        <p className="text-[12px] text-gray-400 mt-0.5">Browse help topics</p>
      </div>

      <div className="flex flex-col gap-4">
        {KB_CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}
              >
                {cat.icon}
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-gray-800">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-gray-400">{cat.description}</p>
              </div>
            </div>
            <span className="text-[11px] text-gray-400">
              {cat.articles} articles
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
