import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Create a URL-friendly slug from a name. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Very small helper for safe array filtering by search query. */
export function includesSearch(values: Array<string | number | undefined | null>, search?: string) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return values.some((value) => String(value ?? "").toLowerCase().includes(needle));
}

export function copyToClipboard(text: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return Promise.resolve(false);
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}
