"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { footer } from "framer-motion/client";

export default function Footer() {
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  // Social Icons Data
  const socialIcons = [
    { name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
    { name: "Pinterest", path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z" },
    { name: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { name: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }
  ];

  return (
    <footer className="bg-[#080808] md:bg-[#111111] text-[#f5f3ef] md:text-white pt-16 md:pt-20 lg:pt-32 pb-8 border-t border-[#222222] md:border-[#333333]">
      <div className="max-w-[var(--container-lg)] mx-auto px-8 md:px-6">

        {/* ================================================== */}
        {/* DESKTOP FOOTER (min-width: 768px)                  */}
        {/* ================================================== */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

          {/* Column 1: Brand */}
          <div className="flex flex-col lg:pr-8">
            <Link href="/" className="mb-8 inline-block">
              <Image
                src="/logo/HOD_LOGO.webp"
                alt="House of Décor"
                width={180}
                height={40}
                style={{ width: "auto", height: "auto" }}
                className="h-10 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-[#D0D0D0] text-sm leading-relaxed font-light mb-8 max-w-sm">
              Premium handwoven rugs and curtains crafted with timeless artistry and delivered with excellence.
            </p>
          </div>

          {/* Column 2: About Us */}
          <div className="flex flex-col">
            <h4 className="font-sans font-medium text-sm tracking-[0.15em] uppercase mb-8">About Us</h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Rugs', href: '/products/rugs' },
                { label: 'Contact', href: '/contact' },
                { label: 'Blog', href: '/blog' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#8C8C8C] hover:text-[var(--bg-primary)] transition-colors duration-300 font-light text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col">
            <h4 className="font-sans font-medium text-sm tracking-[0.15em] uppercase mb-8">Resources</h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'Bespoke Rugs & Textiles', href: '/bespoke' },
                { label: 'Know Your Rug', href: '/know-your-rug' },
                { label: 'Designer Trade Program', href: '/designer-trade-program' },
                { label: 'Size & Fitting Guide', href: '/size-fitting-guide' },
                { label: 'Care & Cleaning', href: '/care-cleaning' },
                { label: 'Terms & Conditions', href: '/terms-conditions' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#8C8C8C] hover:text-[var(--bg-primary)] transition-colors duration-300 font-light text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="flex flex-col">
            <h4 className="font-sans font-medium text-sm tracking-[0.15em] uppercase mb-8">Stay Connected</h4>
            <div className="flex gap-4">
              {/* Social Icons (Square, 1px border) */}
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={`#${social.name}`}
                  aria-label={social.name}
                  className="w-10 h-10 border border-[#333333] flex items-center justify-center rounded-none text-[#D0D0D0] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] hover:border-[var(--accent-secondary)] transition-colors duration-300 group"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR (DESKTOP) */}
        <div className="hidden md:flex flex-row justify-between items-center pt-8 border-t border-[#333333] gap-6">
          <p className="text-[#8C8C8C] text-xs tracking-wide">
            &copy; {new Date().getFullYear()} House of Décor. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-[#8C8C8C] hover:text-[var(--bg-primary)] transition-colors duration-300 text-xs tracking-wide"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* MOBILE FOOTER (max-width: 768px)                   */}
      {/* ================================================== */}
      <div className="md:hidden flex flex-col w-full px-8">

        {/* 1. Brand Block */}
        <div className="flex flex-col items-center text-center mb-10">
          <Link href="/" className="mb-6 inline-block">
            <Image
              src="/logo/HOD_LOGO.webp"
              alt="House of Décor"
              width={160}
              height={36}
              style={{ width: "auto", height: "auto" }}
              className="h-10 w-auto object-contain brightness-0 invert opacity-90"
            />
          </Link>
          <p className="text-[#b8b8b8] text-sm leading-relaxed font-sans font-light max-w-[280px]">
            Premium handwoven rugs and curtains crafted with timeless artistry and delivered with excellence.
          </p>
        </div>

        {/* 2. Footer Links (Stacked) */}
        <div className="flex flex-col gap-10 mb-10 border-t border-[#222222] pt-10">

          {/* ABOUT US */}
          <div className="flex flex-col border-b border-[#222222]">
            <button 
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="flex justify-between items-center w-full py-4"
            >
              <h4 className="font-sans font-medium text-xs tracking-[0.15em] uppercase text-[#f5f3ef]">About Us</h4>
              <span className="text-[#f5f3ef] text-lg font-light leading-none">
                {mobileAboutOpen ? '−' : '+'}
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                mobileAboutOpen ? 'max-h-64 pb-6 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="flex flex-col gap-4">
                {['About', 'Services', 'Rugs', 'Contact', 'Blog'].map((link) => (
                  <li key={link}>
                    <Link href={`/${link.toLowerCase()}`} className="text-[#b8b8b8] hover:text-[#d4b06a] font-sans font-light text-sm transition-colors block">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RESOURCES */}
          <div className="flex flex-col border-b border-[#222222]">
            <button 
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
              className="flex justify-between items-center w-full py-4"
            >
              <h4 className="font-sans font-medium text-xs tracking-[0.15em] uppercase text-[#f5f3ef]">Resources</h4>
              <span className="text-[#f5f3ef] text-lg font-light leading-none">
                {mobileResourcesOpen ? '−' : '+'}
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                mobileResourcesOpen ? 'max-h-64 pb-6 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="flex flex-col gap-4">
                {[
                  { label: 'Create Your Rug', href: '/create-your-own-rug' },
                  { label: 'Know Your Rug', href: '/know-your-rug' },
                  { label: 'Designer Trade Program', href: '/designer-trade-program' },
                  { label: 'Size & Fitting Guide', href: '/size-fitting-guide' },
                  { label: 'Care & Cleaning', href: '/care-cleaning' },
                  { label: 'Terms & Conditions', href: '/terms-conditions' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[#b8b8b8] hover:text-[#d4b06a] font-sans font-light text-sm transition-colors block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Social Section */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-4">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={`#${social.name}`}
                aria-label={social.name}
                className="w-12 h-12 border border-[#222222] flex items-center justify-center rounded-none text-[#b8b8b8] hover:border-[#d4b06a] hover:text-[#d4b06a] transition-colors duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* 4. Bottom Legal Section */}
        <div className="flex flex-col items-center pt-8 border-t border-[#222222] gap-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <Link key={link} href="#" className="text-[#b8b8b8] hover:text-[#f5f3ef] text-xs font-sans tracking-wide transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <p className="text-[#b8b8b8] text-xs tracking-wide font-sans mt-2">
            &copy; {new Date().getFullYear()} House of Décor. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
