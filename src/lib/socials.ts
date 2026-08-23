import { InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export interface Social {
  Icon: Icon;
  label: string;
  /** Public handle, shown where there's room for it. */
  handle: string;
  href: string;
}

/**
 * Single source for the social accounts — the hero, the footer and the mobile
 * menu all read from here.
 *
 * TODO: these handles are placeholders. Confirm the real account URLs and
 * replace them here; nothing else needs touching.
 */
export const SOCIALS: Social[] = [
  {
    Icon: InstagramLogo,
    label: "Instagram",
    handle: "@feelzfilms",
    href: "https://instagram.com/feelzfilms",
  },
  {
    Icon: LinkedinLogo,
    label: "LinkedIn",
    handle: "/feelzfilms",
    href: "https://linkedin.com/company/feelzfilms",
  },
];
