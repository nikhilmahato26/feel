import { MapPin } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="border-t border-(--border) py-12">
      <div className="max-w-285 mx-auto px-6 md:px-8 flex flex-wrap justify-between gap-10 text-sm text-(--text-secondary)">
        <div>
          <div className="font-display font-bold text-lg tracking-tight text-(--text)">
            FEELZ <span className="text-(--accent)">FILMS</span>
          </div>
          <p className="mt-2 max-w-[28ch]">Turning expertise into content, authority and growth.</p>
        </div>

        <div className="space-y-1">
          <p>
            <a href="mailto:connect@feelzfilms.com" className="cursor-hover-target hover:text-(--accent) transition-colors">
              connect@feelzfilms.com
            </a>
          </p>
          <p>
            <a
              href="https://www.feelzfilms.com"
              className="cursor-hover-target hover:text-(--accent) transition-colors"
            >
              www.feelzfilms.com
            </a>
          </p>
        </div>

        <div className="space-y-1">
          <p>Markets served</p>
          <p>US, UK, Canada, Australia, UAE, India</p>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={17} weight="light" />
          <span>HQ: New Delhi, India</span>
        </div>
      </div>
    </footer>
  );
}
