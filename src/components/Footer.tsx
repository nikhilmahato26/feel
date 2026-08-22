"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy } from "@phosphor-icons/react";

interface FooterItem {
  text: string;
  /** In-app route or anchor, routed through the router. */
  to?: string;
  /** External destination. */
  href?: string;
}

const COLUMNS: Array<{ label: string; items: FooterItem[] }> = [
  {
    label: "Navigate",
    items: [
      { text: "About", to: "/#about" },
      { text: "How it works", to: "/#how-it-works" },
      { text: "Services", to: "/#services" },
      { text: "Portfolio", to: "/portfolio" },
    ],
  },
  {
    label: "Studio",
    items: [{ text: "India" }, { text: "www.feelzfilms.com", href: "https://www.feelzfilms.com" }],
  },
];

const EMAIL = "connect@feelzfilms.com";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context / permissions) — the mailto link
      // beside this button still works, so fail quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${EMAIL} to clipboard`}
      className="cursor-hover-target group inline-flex items-center gap-2 text-(--text-secondary) hover:text-(--accent) transition-colors duration-300"
    >
      <span className="u-meta">{copied ? "Copied" : "Copy"}</span>
      {copied ? <Check size={13} weight="bold" /> : <Copy size={13} />}
    </button>
  );
}

export default function Footer() {
  return (
    <footer className="pt-20 pb-10">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <div className="grid gap-12 md:grid-cols-12 pb-16">
          <div className="md:col-span-6">
            <div className="font-display font-bold text-lg tracking-tight">
              FEELZ <span className="text-(--accent)">FILMS</span>
            </div>
            <p className="u-meta mt-3 text-(--text-secondary)">
              Production House Pvt. Ltd.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-(--text-secondary) max-w-[30ch]">
              Marketing that turns expertise into authority, demand and growth.
            </p>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <a
                href={`mailto:${EMAIL}`}
                className="cursor-hover-target link-wipe text-sm font-medium"
              >
                {EMAIL}
              </a>
              <CopyEmail />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.label} className="md:col-span-3">
              <h3 className="u-meta text-(--text-secondary) mb-5">{col.label}</h3>
              <ul className="space-y-3 text-sm">
                {col.items.map((it) => (
                  <li key={it.text}>
                    {it.to ? (
                      <Link
                        to={it.to}
                        className="cursor-hover-target link-wipe text-(--text-secondary) hover:text-(--text) transition-colors duration-300"
                      >
                        {it.text}
                      </Link>
                    ) : it.href ? (
                      <a
                        href={it.href}
                        className="cursor-hover-target link-wipe text-(--text-secondary) hover:text-(--text) transition-colors duration-300"
                      >
                        {it.text}
                      </a>
                    ) : (
                      <span className="text-(--text-secondary)">{it.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="u-rule" />

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="u-meta text-(--text-secondary) opacity-85">
            © {new Date().getFullYear()} Feelz Films Production House Pvt. Ltd.
          </span>
          <span className="u-meta text-(--text-secondary) opacity-85">India · Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
