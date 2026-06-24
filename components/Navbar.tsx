"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const navItems = [
  { label: "Platform", href: "/#platform" },
  { label: "Dashboards", href: "/dashboard" },
  { label: "For Students", href: "/students" },
  { label: "For Faculty", href: "/faculty" },
  { label: "Executive", href: "/executive" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-soft border-b border-silver/70"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-deepblue to-emerald text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Sparkles size={18} />
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-navy">
            Curriculum<span className="text-emerald">IQ</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-navy group/navlink inline-block"
              >
                {item.label}
                <span className="pointer-events-none absolute left-4 right-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-deepblue to-emerald transition-transform duration-300 ease-out group-hover/navlink:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#demo"
            className="text-sm font-medium text-muted hover:text-navy transition-colors duration-200"
          >
            Explore Demo Report
          </Link>
          <Link
            href="/#upload"
            className="btn-ripple group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald to-teal opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            <span className="relative">Upload Curriculum</span>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden text-navy"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-silver"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-navy transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#upload"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-deepblue to-emerald px-5 py-2.5 text-sm font-semibold text-white shadow-soft"
                >
                  Upload Curriculum
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
