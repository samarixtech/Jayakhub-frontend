"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setCart } from "@/redux/slices/cartSlice";

const CART_STORAGE_KEY = "ifdp-cart-data";

export default function CartPersistence() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          dispatch(setCart(parsedCart));
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    } finally {
      setIsHydrated(true);
    }
  }, [dispatch]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  return null;
}
