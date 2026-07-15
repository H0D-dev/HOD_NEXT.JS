import Image from "next/image";
import { useCartStore, type CartItem as CartItemType } from "@/src/lib/store/useCartStore";
import { formatPrice } from "@/src/lib/utils/price";
import { X, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  context?: "drawer" | "page";
}

export default function CartItem({ item, context = "drawer" }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleDecrease = () => updateQuantity(item.id, item.quantity - 1);
  const handleIncrease = () => updateQuantity(item.id, item.quantity + 1);

  const isPage = context === "page";

  return (
    <div className={`flex gap-4 py-4 border-b border-[var(--border-secondary)] ${isPage ? 'md:py-6 md:gap-8' : ''}`}>
      <div className={`relative shrink-0 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] ${isPage ? 'w-[80px] h-[100px] md:w-[120px] md:h-[150px]' : 'w-[80px] h-[100px]'}`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col grow justify-between py-1">
        
        {/* Top Section: Info & Price */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col">
            <h4 className="font-sans text-base md:text-lg font-medium text-[var(--text-primary)] leading-tight m-0 tracking-tight">
              {item.name}
            </h4>
            <p className="font-sans text-[10px] md:text-[11px] text-[var(--text-secondary)] uppercase tracking-[0.05em] mt-1">
              {item.category === "rug" ? "Rug" : "Curtain"}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button 
              className={`text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 -mr-1 mb-1 md:hidden`}
              onClick={() => removeItem(item.id)}
              aria-label="Remove item"
            >
              <X size={16} strokeWidth={1} />
            </button>
            <div className="font-sans text-base md:text-lg text-[var(--text-primary)] font-normal tracking-tight hidden md:block">
              {formatPrice(item.price, item.currency || "AED")}
            </div>
          </div>
        </div>

        {/* Bottom Section: Details & Actions */}
        <div className="flex justify-between items-end mt-4 md:mt-0 gap-4">
          
          {/* Variants/Details */}
          <div className="flex flex-col gap-[2px] font-sans text-xs md:text-sm text-[var(--text-secondary)]">
            {item.category === "rug" && item.variant && (
              <>
                {item.variant.size && <span>Size: {item.variant.size.replace(/\s*cm\s*$/i, '')} cm</span>}
                {item.variant.color && (
                  <span className="flex items-center gap-1.5">
                    Color: 
                    {item.variant.color.startsWith('#') ? (
                      <span className="w-[10px] h-[10px] rounded-full border border-[var(--border-secondary)] block" style={{ backgroundColor: item.variant.color }} aria-label={item.variant.color} />
                    ) : (
                      item.variant.color
                    )}
                  </span>
                )}
                {item.variant.material && <span>Material: {item.variant.material}</span>}
              </>
            )}
            {item.category === "curtain" && item.variant && (
              <>
                {(item.variant.width && item.variant.height) && (
                  <span>Size: {item.variant.width} × {item.variant.height}</span>
                )}
                {item.variant.fabric && <span>Fabric: {item.variant.fabric}</span>}
                {item.variant.lining && <span>Lining: {item.variant.lining}</span>}
                {item.variant.pleatStyle && <span>Pleat: {item.variant.pleatStyle}</span>}
              </>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="font-sans text-base md:text-lg text-[var(--text-primary)] font-normal tracking-tight md:hidden">
              {formatPrice(item.price, item.currency || "AED")}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[var(--border-secondary)] h-8 w-[84px] md:h-9 md:w-[90px]">
                <button 
                  onClick={handleDecrease} 
                  aria-label="Decrease quantity" 
                  disabled={item.quantity <= 1}
                  className="w-8 h-full flex items-center justify-center text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={14} strokeWidth={1} />
                </button>
                <span className="font-sans text-xs md:text-sm w-6 flex justify-center select-none">{item.quantity}</span>
                <button 
                  onClick={handleIncrease} 
                  aria-label="Increase quantity"
                  className="w-8 h-full flex items-center justify-center text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <Plus size={14} strokeWidth={1} />
                </button>
              </div>
              
              {isPage && (
                <button 
                  className="hidden md:block font-sans text-[10px] md:text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em] hover:text-[var(--text-primary)] transition-colors border-b border-transparent hover:border-[var(--text-primary)]"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
