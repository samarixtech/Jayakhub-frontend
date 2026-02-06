"use client";

import { Provider } from "react-redux";
import { store } from "./../redux/store/store";

import CartPersistence from "./common/CartPersistence";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartPersistence />
      {children}
    </Provider>
  );
}
