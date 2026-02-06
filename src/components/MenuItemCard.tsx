// src/components/MenuItemCard.tsx (Updated to support Modal click)
import React from "react";
import { MenuItem } from "@/types/menu";
import { Currency, Plus } from "lucide-react";
import { useCLC } from "@/app/context/CLCContext";

interface MenuItemCardProps {
  item: MenuItem;
  // NEW PROP: When clicking the card itself (opens modal)
  onItemClick: (item: MenuItem) => void;
  // Existing PROP: When clicking ONLY the Plus button (simple add, optional)
  onAddItem: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onItemClick,
  onAddItem,
}) => {
  const { currency } = useCLC();
  return (
    // Wrap the entire card content with the modal opener
    <div
      className="flex justify-between items-start p-6 bg-[#E8F4F1] transition duration-200 cursor-pointer 
                 hover:shadow-lg hover:z-10 rounded-xl"
      // Open Modal when card is clicked
      onClick={() => onItemClick(item)}
    >
      <div className="flex-1 pr-4">
        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
        <p className="text-xl font-extrabold text-green-500 mt-1">
          {currency}. {item.price.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="flex-shrink-0 relative w-28 h-28">
        <div className="w-full h-full bg-[#FFF9EE] rounded-xl overflow-hidden">
          <img
            src={item.imageUrl || "/images/placeholder.jpg"}
            alt={item.name}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Plus button: Direct Add (if no customization is needed for this item, or as a quick add) */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Stop event from triggering the parent card's onClick (modal)
            onAddItem(item);
          }}
          className="absolute bottom-[-10px] right-[-10px] 
                     bg-green-600 text-[#E8F4F1] rounded-full 
                     shadow-xl shadow-green-400/50 p-2 
                     hover:bg-green-700 transition transform active:scale-90"
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
