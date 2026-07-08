import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: number; // Woo product ID for order creation
  variationId?: number; // Woo variation ID for variable products
  slug: string;
  name: string;
  category: "rug" | "curtain";
  image: string;
  price: number;
  currency: string;
  quantity: number;
  variant?: {
    color?: string;
    material?: string;
    size?: string;
    shape?: string;
    width?: string;
    height?: string;
    fabric?: string;
    lining?: string;
    pleatStyle?: string;
  };
}

export interface CartStore {
  items: CartItem[];
  cartCurrency: string | null;
  isDrawerOpen: boolean;
  addItem: (item: CartItem) => { success: boolean; error?: string; lockedCurrency?: string };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: number;
  subtotal: number;
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, subtotal };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartCurrency: null,
      isDrawerOpen: false,
      totalItems: 0,
      subtotal: 0,

      addItem: (newItem) => {
        const state = get();
        const newCartCurrency = state.items.length === 0 ? newItem.currency : state.cartCurrency;
        
        if (state.items.length > 0 && state.cartCurrency !== newItem.currency) {
          console.warn(`Cart currency is locked to ${state.cartCurrency}. Cannot add item in ${newItem.currency}.`);
          return { success: false, error: `Your cart already contains items in ${state.cartCurrency}. You cannot mix currencies.` };
        }

        const existingItem = state.items.find((item) => item.id === newItem.id);
        let newItems;
        if (existingItem) {
          newItems = state.items.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          newItems = [...state.items, newItem];
        }
        
        set({ items: newItems, cartCurrency: newCartCurrency, ...calculateTotals(newItems) });
        return { success: true, lockedCurrency: newCartCurrency };
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const newCartCurrency = newItems.length === 0 ? null : state.cartCurrency;
          return { items: newItems, cartCurrency: newCartCurrency, ...calculateTotals(newItems) };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0, cartCurrency: null }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "hod-cart-storage",
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal,
        cartCurrency: state.cartCurrency
      }),
    }
  )
);
