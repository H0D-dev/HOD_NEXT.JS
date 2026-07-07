"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/src/lib/store/useCartStore";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { useCurrencyStore } from "@/src/lib/store/useCurrencyStore";
import { Currency } from "@/src/components/product-presentation/ProductPresentation";
import "./Header.css";

/* ── Navigation Links Data ── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { openDrawer, totalItems, items, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as Currency;
    if (items.length > 0 && newCurrency !== currency) {
      const confirmClear = window.confirm(`Your cart is currently in ${currency}. Changing the currency will clear your cart. Do you want to proceed?`);
      if (confirmClear) {
        clearCart();
        setCurrency(newCurrency);
      }
    } else {
      setCurrency(newCurrency);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push("/account");
    } else {
      router.push("/register");
    }
    // Close mobile menu if it's open
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ── Mobile Overlay ── */}
      <div 
        className={`header__overlay ${isMobileMenuOpen ? "header__overlay--open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
        <div className="header__container">
          <div className="header__left">
            {/* ── Logo ── */}
            <Link href="/" className="header__logo">
              <Image 
                src="/logo/HOD_LOGO.webp" 
                alt="House of Décor" 
                width={160} 
                height={36} 
                className="header__logo-img--desktop"
              />
              <span className="header__logo-text header__logo-text--mobile">HOD</span>
            </Link>

            {/* ── Navigation Links ── */}
            <nav className={`header__nav ${isMobileMenuOpen ? "header__nav--open" : ""}`} aria-label="Main Navigation">
              <div className="header__nav-header">
                <button 
                  className="header__close-btn" 
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <ul className="header__nav-list">
                {NAV_LINKS.map((link) => (
                  <li key={link.label} className="header__nav-item">
                    <Link href={link.href} className="header__nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="header__mobile-cart">
                <button className="header__cart-btn" aria-label="Open cart" onClick={openDrawer}>
                  <div className="header__cart-icon-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                    </svg>
                    {mounted && totalItems > 0 && (
                      <span className="header__cart-badge">{totalItems}</span>
                    )}
                  </div>
                  <span className="header__mobile-cart-label">Cart</span>
                </button>
                <button className="header__cart-btn" aria-label="Profile" onClick={handleProfileClick} style={{ marginTop: "1rem" }}>
                  <div className="header__cart-icon-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                    </svg>
                  </div>
                  <span className="header__mobile-cart-label">Profile</span>
                </button>
              </div>
            </nav>
          </div>

          {/* ── Right Group ── */}
          <div className="header__right">
            {/* ── Currency Selector ── */}
            {mounted && (
              <div className="header__currency-selector mr-4 hidden md:block">
                <select 
                  value={currency} 
                  onChange={handleCurrencyChange}
                  className="bg-transparent border-none text-[var(--text-primary)] text-[var(--text-sm)] font-medium outline-none cursor-pointer tracking-wider"
                  aria-label="Select Currency"
                >
                  <option value="AED">AED</option>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            )}
            <button className="header__cart-btn header__desktop-cart-btn" aria-label="Open cart" onClick={openDrawer}>
              <div className="header__cart-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                </svg>
                {mounted && totalItems > 0 && (
                  <span className="header__cart-badge">{totalItems}</span>
                )}
              </div>
            </button>
            <button className="header__cart-btn header__desktop-cart-btn" aria-label="Profile" onClick={handleProfileClick}>
              <div className="header__cart-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                </svg>
              </div>
            </button>
            <button 
              className="header__hamburger-btn" 
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
