import { InstagramLogo, LinkedinLogo, YoutubeLogo, XLogo } from "@phosphor-icons/react";
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
 * Instagram and LinkedIn are the confirmed accounts.
 *
 * TODO: the YouTube channel and the X account are still guesses built from the
 * Instagram handle. Send the real URLs and replace them here; nothing else
 * needs touching.
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
  {
    Icon: YoutubeLogo,
    label: "YouTube",
    handle: "@feelz_films",
    href: "https://www.youtube.com/@feelz_films",
  },
  {
    Icon: XLogo,
    label: "X",
    handle: "@feelz_films",
    href: "https://x.com/feelz_films",
  },
];
