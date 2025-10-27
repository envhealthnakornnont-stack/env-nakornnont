import type { ComponentProps } from "react";

export type Variant = "emergency" | "warning" | "info" | "success";
export type StorageMode = "session" | "local";

export type BannerBase = {
    id: string;              // สำคัญ: ใช้ผูก cookie/TTL ต่ออัน
    message: string;
    title?: string;
    href?: string;
    variant?: Variant;
    compact?: boolean;
    ttlMs?: number;
};

export type BannerProps = BannerBase & {
    className?: string;
    sticky?: boolean;
    navbarHeight?: number;    // px
    persistStorage?: StorageMode; // ดีฟอลต์ "session"
    onClose?: () => void;
} & ComponentProps<"div">;

export type CookieState = { closedAt: number };
