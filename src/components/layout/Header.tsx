"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">

        <div className="header__left">
          {/* ── Logo ── */}
          <Link href="/" className="header__logo">
            <span className="header__logo-text">HOUSE OF DÉCOR</span>
          </Link>

          {/* ── Navigation Links ── */}
          <nav className="header__nav" aria-label="Main Navigation">
            <ul className="header__nav-list">
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="header__nav-item">
                  <Link href={link.href} className="header__nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Cart (Right) ── */}
        <div className="header__right">
          <button className="header__cart-btn" aria-label="Open cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
