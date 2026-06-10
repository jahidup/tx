import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: value instanceof Date || String(value).includes("T") ? "short" : undefined
  }).format(new Date(value));
}

export function formatNumber(value: number | undefined | null, fallback = "0") {
  if (value === undefined || value === null || Number.isNaN(value)) return fallback;
  return new Intl.NumberFormat("en-IN").format(value);
}

export function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function absoluteUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(path, siteUrl).toString();
}

export function initials(name?: string | null) {
  if (!name) return "SD";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function sanitizeObject<T>(input: T): T {
  if (Array.isArray(input)) return input.map((item) => sanitizeObject(item)) as T;
  if (input && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input as Record<string, unknown>)
        .filter(([key]) => !key.startsWith("$"))
        .map(([key, value]) => [key.replace(/\./g, "_"), sanitizeObject(value)])
    ) as T;
  }
  return input;
}

export function csvSafe(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}
