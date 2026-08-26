/** Where "Book a call" goes. Titan's scheduling page for the studio. */
export const BOOKING_URL = "https://book.titan.email/feelzfilms";

export const EMAIL = "connect@feelzfilms.com";

/** Prefilled email, for the places that ask for something specific. */
export function mailto(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}
