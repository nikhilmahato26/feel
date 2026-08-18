"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Sun, Moon } from "@phosphor-icons/react";
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

export default function Nav({ theme, onToggleTheme }: NavProps) {
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [elevated, setElevated] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setElevated(y > 60);
    setHidden(y > lastY.current && y > 160);
    lastY.current = y;
  });

  return (
    <motion.nav
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-8 md:py-5 border-b border-(--border) bg-(--bg)/90 backdrop-blur-md transition-shadow duration-300"
      style={{ boxShadow: elevated ? "var(--shadow-sm)" : "none" }}
    >
      <a href="#" className="font-display font-bold text-lg tracking-tight">
        FEELZ <span className="text-(--accent)">FILMS</span>
      </a>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-(--text-secondary)">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="cursor-hover-target relative py-1 hover:text-(--text) transition-colors duration-200 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-(--accent) after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="cursor-hover-target flex items-center gap-2 rounded-full border border-(--border) px-3 py-2 text-xs font-medium hover:border-(--accent) active:scale-95 transition-[border-color,transform] duration-200"
        >
          {theme === "dark" ? <Moon size={15} weight="fill" /> : <Sun size={15} />}
          <span className="hidden sm:inline">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
        </button>
        <MagneticButton href="mailto:connect@feelzfilms.com?subject=Book%20a%20call" variant="primary">
          Book a call
        </MagneticButton>
      </div>
    </motion.nav>
  );
}
