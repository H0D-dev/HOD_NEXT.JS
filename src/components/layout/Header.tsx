"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./Header.css";

/* ── Navigation Links Data ── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
                width={180} 
                height={40} 
                className="header__logo-img"
                style={{ width: "auto" }}
                priority
                loading="eager"
              />
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
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <button className="header__cart-btn" aria-label="Open cart">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                  </svg>
                  <span className="header__mobile-cart-label">Cart</span>
                </button>
              </div>
            </nav>
          </div>

          {/* ── Right Group ── */}
          <div className="header__right">
            <button className="header__cart-btn header__desktop-cart-btn" aria-label="Open cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
              </svg>
            </button>
            <button 
              className="header__hamburger-btn" 
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
