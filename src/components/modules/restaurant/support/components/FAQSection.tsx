"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How do I change my restaurant logo?",
    a: "Navigate to Settings > Profile and click on the camera icon to upload a new logo picture.",
  },
  {
    q: "When do I get paid?",
    a: "Payouts are processed weekly. You can expect funds to arrive in your designated bank account every Wednesday.",
  },
  {
    q: "Can I set different hours for weekends?",
    a: "Yes, go to Settings > Opening Hours. You can define specific time slots for each day of the week.",
  },
  {
    q: "How do I add a new menu item?",
    a: "Go to Menu Management, select a category, and click the 'Add Item' button to enter the item details and price.",
  },
  {
    q: "What happens when I mark an order as 'Ready'?",
    a: "The customer and delivery driver are notified immediately that the order is prepared and ready for pickup.",
  },
  {
    q: "How do I handle a customer complaint?",
    a: "Please reach out to our Support team via Live Chat or Phone. We will mediate the process.",
  },
  {
    q: "Can I export my financial data?",
    a: "Yes, you can export your payout and transaction history as a CSV file from the Finance tab.",
  },
  {
    q: "How do I add team members?",
    a: "Go to Account & Settings > Team roles, and click 'Invite Member' to assign them specific access permissions.",
  },
];

export const FAQSection = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">
        Frequently Asked Questions
      </h3>
      <div className="flex flex-col">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex flex-col py-3.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
            onClick={() => toggleFaq(i)}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-700 font-medium">
                {item.q}
              </span>
              <ChevronRight
                className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`}
              />
            </div>
            {expandedFaq === i && (
              <div className="mt-2 text-[12px] text-gray-500 pr-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
