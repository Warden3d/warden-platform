import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Single EUR price formatter for the UI: comma decimal, "€" suffix.
 * "54.99" → "54,99 €"
 */
export function formatPriceEUR(amount: number): string {
  return `${amount.toFixed(2).replace(".", ",")} €`
}
