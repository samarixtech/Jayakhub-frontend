import { CartItem } from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartItemsFromDB, getPendingOrdersFromDB, savePendingOrdersToDB } from "@/lib/indexedDB";

export const loadCartFromDB = createAsyncThunk(
  "cart/loadCartFromDB",
  async () => {
    const [items, pending] = await Promise.all([
      getCartItemsFromDB(),
      getPendingOrdersFromDB()
    ]);
    return {
      items: items as CartItem[],
      pendingOrders: (pending || []) as PendingOrder[]
    };
  }
);

export interface PendingOrder {
  id: string;
  items: CartItem[];
  orderType: "Dine-In" | "TakeAway" | "Delivery";
  timestamp: string;
  tableName?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  orderType: "Dine-In" | "TakeAway" | "Delivery";
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
    ? JSON.stringify((item.selectedVariations || []).map((v) => v.name).sort())
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
        state.items[itemIndex].cartId = generateCartId(state.items[itemIndex]);
      }
    },

    updateItemVariations: (
      state,
      action: PayloadAction<{ id: string; variations: any[] }>,
    ) => {
      const { id, variations } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.cartId === id || item.id === id,
      );

      if (itemIndex >= 0) {
        state.items[itemIndex].selectedVariations = variations;
        // Keep selectedVariation in sync with first entry for backward compat
        state.items[itemIndex].selectedVariation = variations[0]
          ? { name: variations[0].name, additionalPrice: variations[0].additionalPrice }
          : undefined;
        state.items[itemIndex].cartId = generateCartId(state.items[itemIndex]);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    setOrderType: (state, action: PayloadAction<"Dine-In" | "TakeAway" | "Delivery">) => {
      state.orderType = action.payload;
    },

    saveToPendingOrders: (state, action: PayloadAction<{ tableName?: string } | undefined>) => {
      if (state.items.length === 0) return;
      const newPendingOrder: PendingOrder = {
        id: `PO-${Date.now()}`,
        items: [...state.items],
        orderType: state.orderType,
        timestamp: new Date().toISOString(),
        tableName: action.payload?.tableName,
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
      state.items = action.payload?.items || [];
      state.pendingOrders = action.payload?.pendingOrders || [];
      state.isLoading = false;
    });
    builder.addCase(loadCartFromDB.rejected, (state) => {
      state.items = [];
      state.pendingOrders = [];
      state.isLoading = false;
    });
  }
});

export const saveToPendingOrdersThunk = createAsyncThunk(
  "cart/saveToPendingOrdersThunk",
  async (payload: { tableName?: string } | undefined, { dispatch, getState }) => {
    dispatch(saveToPendingOrders(payload));
    const state = getState() as { cart: CartState };
    await savePendingOrdersToDB(state.cart.pendingOrders);
  }
);

export const restoreFromPendingThunk = createAsyncThunk(
  "cart/restoreFromPendingThunk",
  async (id: string, { dispatch, getState }) => {
    dispatch(restoreFromPending(id));
    const state = getState() as { cart: CartState };
    // Immediately persist the removed item back to DB
    await savePendingOrdersToDB(state.cart.pendingOrders);
  }
);

export const { addToCart, updateQuantity, updateItemVariation, updateItemVariations, clearCart, setCart, setOrderType, saveToPendingOrders, restoreFromPending } =
  cartSlice.actions;

export default cartSlice.reducer;
