"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getPosItems } from "@/app/actions/restaurant/pos";
import { getTablesAction } from "@/app/actions/restaurant/tables";
import { getTableStatusesFromDB } from "@/lib/indexedDB";

export type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variations?: { name: string; additionalPrice: number }[];
    selectedVariation?: { name: string; additionalPrice: number };
};

interface POSContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    updateItemVariation: (id: number, variation: { name: string; additionalPrice: number }) => void;
    activeModifierItemId: string | number | null;
    setActiveModifierItemId: (id: string | number | null) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    subtotal: number;
    tax: number;
    total: number;
    activeView: "menu" | "online";
    setActiveView: (view: "menu" | "online") => void;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    posItems: any[];
    globalCategories: string[];
    isPosLoading: boolean;
    selectedTable: { id: string; name: string; status: string } | null;
    setSelectedTable: (table: { id: string; name: string; status: string } | null) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState<"menu" | "online">("menu");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeModifierItemId, setActiveModifierItemId] = useState<string | number | null>(null);

    // Server API State
    const [posItems, setPosItems] = useState<any[]>([]);
    const [globalCategories, setGlobalCategories] = useState<string[]>([]);
    const [isPosLoading, setIsPosLoading] = useState(false);

    // Global Table State
    const [selectedTable, setSelectedTable] = useState<{ id: string; name: string; status: string } | null>(null);

    // Initial DB Fetch for Selected Table (runs once or when context mounts)
    useEffect(() => {
        const fetchInitialTable = async () => {
            try {
                const [apiRes, dbStatuses] = await Promise.all([
                    getTablesAction(),
                    getTableStatusesFromDB(),
                ]);
                if (apiRes.success && apiRes.data) {
                    const selectedDbStatus = dbStatuses.find(s => s.status === "Selected");
                    if (selectedDbStatus) {
                        const tableData = apiRes.data.find((t: any) => t.id === selectedDbStatus.id);
                        if (tableData) {
                            setSelectedTable({
                                id: tableData.id,
                                name: tableData.name || tableData.id,
                                status: "Selected"
                            });
                        }
                    }
                }
            } catch (err) {
                // silent
            }
        };
        fetchInitialTable();
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchPosData = async () => {
            setIsPosLoading(true);
            try {
                // Determine whether to fetch "all" or filtered subset
                const params = activeCategory === "all" ? undefined : activeCategory;
                const result = await getPosItems(params);

                if (result.success && result.data?.data) {
                    if (isMounted) {
                        setPosItems(result.data.data.items || []);

                        // Categories from API to dynamically build sidebar (only pull "categories" array from response root if present)
                        if (result.data.data.categories) {
                            setGlobalCategories(result.data.data.categories);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed fetching POS items", error);
            } finally {
                if (isMounted) setIsPosLoading(false);
            }
        };

        fetchPosData();

        return () => {
            isMounted = false;
        };
    }, [activeCategory]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        // Optional: automatically open cart on mobile when item added
        if (window.innerWidth < 1024) {
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (id: number) => {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCartItems((prev) =>
            prev.map((i) => {
                if (i.id === id) {
                    const newQty = Math.max(0, i.quantity + delta);
                    return { ...i, quantity: newQty };
                }
                return i;
            }).filter((i) => i.quantity > 0)
        );
    };

    const updateItemVariation = (id: number, variation: { name: string; additionalPrice: number }) => {
        setCartItems((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, selectedVariation: variation } : i
            )
        );
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.selectedVariation ? item.price + item.selectedVariation.additionalPrice : item.price;
        return acc + itemPrice * item.quantity;
    }, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    return (
        <POSContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateItemVariation,
                activeModifierItemId,
                setActiveModifierItemId,
                isCartOpen,
                setIsCartOpen,
                isSidebarOpen,
                setIsSidebarOpen,
                subtotal,
                tax,
                total,
                activeView,
                setActiveView,
                activeCategory,
                setActiveCategory,
                posItems,
                globalCategories,
                isPosLoading,
                selectedTable,
                setSelectedTable
            }}
        >
            {children}
        </POSContext.Provider>
    );
}

export function usePOS() {
    const context = useContext(POSContext);
    if (!context) throw new Error("usePOS must be used within POSProvider");
    return context;
}
