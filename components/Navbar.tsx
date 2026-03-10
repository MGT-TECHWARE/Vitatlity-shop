"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/utils/cart-context";
import { useUser } from "@/hooks/useUser";
import SearchBar from "./SearchBar";
import CartDrawer from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a1628]/95 backdrop-blur-xl shadow-lg border-b border-white/10"
            : "bg-[#0a1628] backdrop-blur-xl border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Search */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors duration-300"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs tracking-wider uppercase hidden sm:block">Search</span>
              </button>
            </div>

            {/* Center: Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image
                src="/nexora-logo.png"
                alt="Nexora Peptides"
                width={200}
                height={50}
                className="object-contain h-10 w-auto"
                priority
              />
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6 mr-4">
                {[
                  { href: "/products", label: "Shop" },
                  { href: "/products?category=vitamins", label: "Vitamins" },
                  { href: "/products?category=protein", label: "Protein" },
                  { href: "/products?category=bundles", label: "Bundles" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs tracking-wider uppercase text-white/50 hover:text-green transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>

              {/* Account */}
              <Link
                href={user ? "/account" : "/account/login"}
                className="p-2 text-white/50 hover:text-white transition-colors duration-300"
                aria-label="Account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-white/50 hover:text-white transition-colors duration-300 relative"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-0.5 -right-0.5 bg-green text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className="overflow-hidden"
              >
                <div className="pb-4">
                  <SearchBar onClose={() => setSearchOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className="md:hidden overflow-hidden"
              >
                <div className="pb-4 pt-2 flex flex-col gap-1">
                  {[
                    { href: "/products", label: "Shop All" },
                    { href: "/products?category=vitamins", label: "Vitamins" },
                    { href: "/products?category=protein", label: "Protein" },
                    { href: "/products?category=weight-loss", label: "Weight Loss" },
                    { href: "/products?category=bundles", label: "Bundles" },
                  ].map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 py-2.5 px-3 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
