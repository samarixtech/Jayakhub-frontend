import { configureStore, Middleware } from '@reduxjs/toolkit';
import cartReducer from './../slices/cartSlice';
import { saveCartItemsToDB } from '@/lib/indexedDB';

const cartDbMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  const result = next(action);
  if (
    action.type?.startsWith('cart/') &&
    !action.type.includes('loadCartFromDB')
  ) {
    const state = storeAPI.getState() as any;
    saveCartItemsToDB(state.cart.items).catch(console.error);
  }
  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartDbMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;