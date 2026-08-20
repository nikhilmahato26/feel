"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useSpring,
} from "motion/react";
import { Sun, Moon, Globe, List, X } from "@phosphor-icons/react";
import MagneticButton from "./MagneticButton";
import type { Theme } from "../lib/useTheme";

interface NavProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
];

/** Marks the link whose section currently owns the viewport. */
function isOutOfBand(el: Element) {
  const r = el.getBoundingClientRect();
  const mid = window.innerHeight / 2;
  return r.bottom < mid || r.top > mid;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = ids
      .map((id) => document.querySelector(id))
      .filter((el): el is Element => el !== null);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActive(`#${visible.target.id}`);
        } else if (targets.every((t) => !t.getBoundingClientRect().height || isOutOfBand(t))) {
          // Nothing owns the viewport (top of page, footer) — clear the marker
          // instead of leaving the last section highlighted.
          setActive(null);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

const IDS = links.map((l) => l.href);

export default function Nav({ theme, onToggleTheme }: NavProps) {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(IDS);

  useMotionValueEvent(scrollY, "change", (y) => {
    setElevated(y > 60);
    // Keep the bar pinned while the mobile sheet is open, otherwise it can
    // slide away with the menu still mounted.
    setHidden(!menuOpen && y > lastY.current && y > 160);
    lastY.current = y;
  });

  // Close on escape and whenever we cross back into the desktop layout.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [menuOpen]);

  return (
    <motion.nav
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-(--border) bg-(--bg)/85 backdrop-blur-xl transition-shadow duration-300"
      style={{ boxShadow: elevated ? "var(--shadow-sm)" : "none" }}
    >
      <div className="relative flex items-center justify-between gap-4 px-6 py-4 md:gap-6 md:px-8">
        {/* Identity — wordmark only. */}
        <a
          href="#"
          className="cursor-hover-target shrink-0 font-display text-lg font-bold tracking-tight text-(--text)"
        >
          Feelz <span className="text-(--accent)">Films</span>
        </a>

        <span className="u-meta hidden lg:block text-(--text-secondary) shrink-0">
          Content_partner
        </span>

        {/* Centred capsule — the page index, held in its own pill. */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-(--hairline-strong) p-1 shrink-0">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className={`cursor-hover-target u-meta rounded-full px-3.5 py-2 transition-colors duration-300 ${
                  isActive
                    ? "bg-(--accent) text-(--accent-text)"
                    : "text-(--text-secondary) hover:text-(--text)"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <span className="u-meta hidden lg:flex items-center gap-1.5 text-(--text-secondary) shrink-0">
          <Globe size={14} />
          New Delhi, India
        </span>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle theme (T)"
            className="cursor-hover-target flex items-center gap-2 rounded-full border border-(--border) px-3.5 py-2 text-(--text) hover:border-(--accent) hover:text-(--accent) active:scale-95 transition-[border-color,color,transform] duration-200"
          >
            {theme === "dark" ? <Moon size={15} weight="fill" /> : <Sun size={15} />}
            <span className="u-meta hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
          </button>

          <MagneticButton
            href="mailto:connect@feelzfilms.com?subject=Book%20a%20call"
            variant="primary"
            className="hidden sm:inline-flex rounded-full"
          >
            Book a call
          </MagneticButton>

          {/* Mobile trigger — the links live behind this below md. */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="cursor-hover-target md:hidden flex items-center justify-center rounded-full border border-(--border) p-2.5 text-(--text) hover:border-(--accent) hover:text-(--accent) active:scale-95 transition-[border-color,color,transform] duration-200"
          >
            {menuOpen ? <X size={17} weight="bold" /> : <List size={17} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet. */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-(--hairline)"
          >
            <div className="flex flex-col px-6 pb-6 pt-2">
              {links.map((l) => {
                const isActive = active === l.href;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={`u-meta flex items-center justify-between border-b border-(--hairline) py-4 transition-colors duration-200 ${
                      isActive ? "text-(--accent)" : "text-(--text)"
                    }`}
                  >
                    {l.label}
                    <span className="u-index text-(--text-secondary)">
                      {String(links.indexOf(l) + 1).padStart(2, "0")}
                    </span>
                  </a>
                );
              })}

              <MagneticButton
                href="mailto:connect@feelzfilms.com?subject=Book%20a%20call"
                variant="primary"
                className="mt-6 w-full rounded-full sm:hidden"
              >
                Book a call
              </MagneticButton>

              <span className="u-meta mt-5 flex items-center gap-1.5 text-(--text-secondary)">
                <Globe size={14} />
                New Delhi, India
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading progress, drawn on the nav's own bottom rule. */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-(--accent) origin-left"
        style={{ scaleX: progress }}
      />
    </motion.nav>
  );
}
