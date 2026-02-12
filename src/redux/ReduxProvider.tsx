"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";

import CartPersistence from "@/components/common/CartPersistence";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartPersistence />
      {children}
    </Provider>
  );
}
