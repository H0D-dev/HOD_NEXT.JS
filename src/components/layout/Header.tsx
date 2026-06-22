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
  return (
    <header className="header">
      <div className="header__container">

        {/* ── Logo (Left) ── */}
        <div className="header__logo">
          <Link href="/" className="header__logo-link">
            HOUSE OF DÉCOR
          </Link>
        </div>

        {/* ── Navigation Links (Center) ── */}
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

        {/* ── Cart (Right) ── */}
        <button className="header__cart-btn" aria-label="Open cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
          </svg>
        </button>

      </div>
    </header>
  );
}
