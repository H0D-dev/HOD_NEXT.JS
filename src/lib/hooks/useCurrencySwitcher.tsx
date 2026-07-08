import { useCartStore } from "@/src/lib/store/useCartStore";
import { useCurrencyStore } from "@/src/lib/store/useCurrencyStore";
import { Currency } from "@/src/components/product-presentation/ProductPresentation";
import toast from "react-hot-toast";
import React from "react";

export function useCurrencySwitcher() {
  const { items, clearCart } = useCartStore();
  const { currency, setCurrency } = useCurrencyStore();

  const handleCurrencyChange = (newCurrency: Currency) => {
    if (items.length > 0 && newCurrency !== currency) {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="text-[var(--text-sm)] text-[var(--text-primary)] m-0">
            Your cart is currently in {currency}. Changing the currency will clear your cart. Do you want to proceed?
          </p>
          <div className="flex justify-end gap-2">
            <button 
              className="px-3 py-1 text-[var(--text-sm)] border border-[var(--border-secondary)] transition-colors hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]" 
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1 text-[var(--text-sm)] bg-[var(--accent-primary)] text-[#111] font-medium transition-colors hover:opacity-80" 
              onClick={() => {
                toast.dismiss(t.id);
                clearCart();
                setCurrency(newCurrency);
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      ), { duration: Infinity, id: 'currency-confirm' });
    } else {
      setCurrency(newCurrency);
    }
  };

  return { currency, handleCurrencyChange };
}
