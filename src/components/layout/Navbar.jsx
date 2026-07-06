import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "https://media.base44.com/images/public/6a1f4949719273f90329fc44/a98525bef_IMG_1485.jpg";

const navLinks = [
  { label: "Shop",     href: "/shop" },
  { label: "Research", href: "/research" },
  { label: "Guide",    href: "/guide" },
  { label: "Protocol", href: "/protocol" },
  { label: "Glossary", href: "/glossary" },
  { label: "COA",      href: "/coa" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "About",    href: "/about" },
];

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/97 backdrop-blur-md shadow-sm" : "bg-white"
        } border-b border-border/60`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center h-20">

            {/* Brand + nav cluster, kept together on the left with a clear gap between them */}
            <div className="flex items-center gap-10 xl:gap-16">
              {/* Logo */}
              <Link to="/" aria-label="Cattleya Labs — go to home page" className="flex items-center gap-2.5 group flex-shrink-0">
                <img
                  src={LOGO_URL}
                  alt=""
                  aria-hidden="true"
                  className="h-11 w-11 object-contain"
                />
                <div className="flex flex-col leading-none" aria-hidden="true">
                  <span className="text-base font-body font-bold tracking-widest uppercase text-primary">
                    CATTLEYA
                  </span>
                  <span className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-primary/70 bg-primary/10 px-1.5 py-0.5 mt-0.5">
                    labs
                  </span>
                </div>
              </Link>

              {/* Desktop nav — only shown at xl+ where all links fit without crowding; below that the hamburger menu is used */}
              <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative text-sm font-body font-semibold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors duration-300 group py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right actions — pushed to the far right */}
            <div className="flex items-center gap-4 ml-auto" role="group" aria-label="Account and cart">
              <Link
                to="/search"
                className="hidden xl:flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                aria-label="Search"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/account"
                className="hidden xl:flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Account</span>
              </Link>

              <button
                onClick={onCartClick}
                aria-label={cartCount > 0 ? `Open cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}` : "Open cart"}
                className="relative p-2 text-foreground/60 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
              >
                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                className="xl:hidden p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
              >
                {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white border-t border-border overflow-hidden"
            >
              <nav aria-label="Mobile navigation" className="px-6 py-6 space-y-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-semibold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/search"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors pt-4 border-t border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                >
                  Search
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                >
                  Account
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}