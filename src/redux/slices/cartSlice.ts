import { CartItem } from "@/types/menu.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const generateCartId = (item: CartItem) => {
  // simple hash based on id and sorted variations
  const vars = item.selectedVariations
    ? JSON.stringify(item.selectedVariations.map((v) => v.name).sort())
    : "";
  return `${item.id}-${vars}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Reducer 1: Add or Increment Item
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const newCartId = newItem.cartId || generateCartId(newItem);

      // Find if an identical item (same ID) already exists
      const existingItem = state.items.find(
        (item) => item.cartId === newCartId,
      );

      // Mutating logic is safe with Redux Toolkit (RTK)
      if (existingItem) {
        // If found, increment quantity
        existingItem.quantity += newItem.quantity;
      } else {
        // If not found, add the new unique item
        state.items.push({ ...newItem, cartId: newCartId });
      }
    },

    // Reducer 2: Update Quantity or Remove Item
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      // id here effectively means cartId
      const itemIndex = state.items.findIndex(
        (item) => item.cartId === id || item.id === id,
      ); // fallback to id for legacy

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less (Trash functionality)
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, updateQuantity, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
