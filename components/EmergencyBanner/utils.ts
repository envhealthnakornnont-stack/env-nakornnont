import { AlertTriangle, CircleAlert, Info, CheckCircle2 } from "lucide-react";
import type { Variant, CookieState } from "./types";

export const PALETTE: Record<Variant, { icon: any; bg: string; border: string; title: string }> = {
    emergency: { icon: AlertTriangle, bg: "bg-red-50 dark:bg-red-900/90", border: "border-red-200 dark:border-red-700", title: "text-red-800 dark:text-red-100" },
    warning: { icon: CircleAlert, bg: "bg-amber-50 dark:bg-amber-900/90", border: "border-amber-200 dark:border-amber-700", title: "text-amber-800 dark:text-amber-100" },
    info: { icon: Info, bg: "bg-sky-50 dark:bg-sky-900/90", border: "border-sky-200 dark:border-sky-700", title: "text-sky-800 dark:text-sky-100" },
    success: { icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-900/90", border: "border-emerald-200 dark:border-emerald-700", title: "text-emerald-800 dark:text-emerald-100" },
};

export const cookieKey = (id: string) => `banner:${id}`;

export function parseCookieState(raw?: string | null): CookieState | null {
    if (!raw) return null;
    try { return JSON.parse(raw) as CookieState; } catch { return null; }
}

export function shouldHideFromCookie(raw: string | null, ttlMs?: number) {
    const obj = parseCookieState(raw);
    if (!obj) return false;
    if (!ttlMs) return true;
    return Date.now() - obj.closedAt < ttlMs;
}
