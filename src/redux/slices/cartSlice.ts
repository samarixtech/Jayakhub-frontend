import { CartItem } from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartItemsFromDB } from "@/lib/indexedDB";

export const loadCartFromDB = createAsyncThunk(
  "cart/loadCartFromDB",
  async () => {
    const items = await getCartItemsFromDB();
    return items as CartItem[];
  }
);

export interface PendingOrder {
  id: string;
  items: CartItem[];
  orderType: "Dine-In" | "Takeaway" | "Delivery";
  timestamp: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  orderType: "Dine-In" | "Takeaway" | "Delivery";
  pendingOrders: PendingOrder[];
}

const initialState: CartState = {
  items: [],
  isLoading: true, // Initially true while we load from DB
  orderType: "Dine-In",
  pendingOrders: [],
};

const generateCartId = (item: CartItem) => {
  const vars = item.selectedVariations
    ? JSON.stringify(item.selectedVariations.map((v) => v.name).sort())
    : "";
  return `${item.id}-${vars}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const newCartId = newItem.cartId || generateCartId(newItem);

      const existingItem = state.items.find(
        (item) => item.cartId === newCartId,
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push({ ...newItem, cartId: newCartId });
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.cartId === id || item.id === id,
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
      }
    },

    updateItemVariation: (
      state,
      action: PayloadAction<{ id: string; variation: { name: string; additionalPrice: number } }>,
    ) => {
      const { id, variation } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.cartId === id || item.id === id,
      );

      if (itemIndex >= 0) {
        state.items[itemIndex].selectedVariation = variation;
        // Optionally update the cartId if we consider variations part of the identity in the cart
        state.items[itemIndex].cartId = generateCartId(state.items[itemIndex]);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    setOrderType: (state, action: PayloadAction<"Dine-In" | "Takeaway" | "Delivery">) => {
      state.orderType = action.payload;
    },

    saveToPendingOrders: (state) => {
      if (state.items.length === 0) return;
      const newPendingOrder: PendingOrder = {
        id: `PO-${Date.now()}`,
        items: [...state.items],
        orderType: state.orderType,
        timestamp: new Date().toISOString(),
      };
      state.pendingOrders.push(newPendingOrder);
      state.items = [];
    },

    restoreFromPending: (state, action: PayloadAction<string>) => {
      const orderIndex = state.pendingOrders.findIndex((o) => o.id === action.payload);
      if (orderIndex >= 0) {
        const order = state.pendingOrders[orderIndex];
        state.items = [...order.items];
        state.orderType = order.orderType;
        state.pendingOrders.splice(orderIndex, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCartFromDB.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadCartFromDB.fulfilled, (state, action) => {
      state.items = action.payload || [];
      state.isLoading = false;
    });
    builder.addCase(loadCartFromDB.rejected, (state) => {
      state.items = [];
      state.isLoading = false;
    });
  }
});

export const { addToCart, updateQuantity, updateItemVariation, clearCart, setCart, setOrderType, saveToPendingOrders, restoreFromPending } =
  cartSlice.actions;

export default cartSlice.reducer;

