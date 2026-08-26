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
 * Instagram and LinkedIn only: the YouTube and X entries were guesses built
 * from the Instagram handle and have been pulled. Add an entry here when a
 * confirmed URL exists and every surface picks it up.
 */
export const SOCIALS: Social[] = [
  {
    Icon: InstagramLogo,
    label: "Instagram",
    handle: "@feelz_films",
    href: "https://www.instagram.com/feelz_films/",
  },
  {
    Icon: LinkedinLogo,
    label: "LinkedIn",
    handle: "Feelz Films",
    href: "https://www.linkedin.com/company/feelz-films-production-house-private-limited/",
  },
];
