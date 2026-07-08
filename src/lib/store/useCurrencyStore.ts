import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Currency } from "@/src/components/product-presentation/ProductPresentation";

interface CurrencyStore {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "AED",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "currency-storage", // key in localStorage
    }
  )
);
