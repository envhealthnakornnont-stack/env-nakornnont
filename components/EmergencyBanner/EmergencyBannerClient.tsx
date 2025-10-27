"use client";

import * as React from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StorageMode, Variant } from "./types";
import { PALETTE, cookieKey } from "./utils";

export default function EmergencyBannerClient({
    id,
    initialOpen,
    message,
    title,
    href = "/announcements",
    variant = "emergency",
    compact = false,
    persistStorage = "session",
    ttlMs,
    onClose,
    className,
}: {
    id?: string;
    initialOpen: boolean;
    message: string;
    title?: string;
    href?: string;
    variant?: Variant;
    compact?: boolean;
    persistStorage?: StorageMode;
    ttlMs?: number;
    onClose?: () => void;
    className?: string;
}) {
    const [open, setOpen] = React.useState(initialOpen);

    // กันกรณี SSR บอก “เปิด” แต่แท็บนี้เคยปิดไว้แล้ว
    React.useEffect(() => {
        if (!id) return;
        try {
            const raw =
                (persistStorage === "local" ? localStorage : sessionStorage).getItem(
                    cookieKey(id)
                );
            if (!raw) return;
            const { closedAt } = JSON.parse(raw) as { closedAt: number };
            if (!ttlMs || Date.now() - closedAt < ttlMs) setOpen(false);
        } catch { }
    }, [id, persistStorage, ttlMs]);

    const close = () => {
        setOpen(false);
        if (!id) return;
        const key = cookieKey(id);
        const now = Date.now();

        // เขียน cookie → SSR รอบถัดไปรู้ว่า “ซ่อน”
        let cookie = `${key}=${encodeURIComponent(
            JSON.stringify({ closedAt: now })
        )}; path=/; SameSite=Lax`;
        if (ttlMs) cookie += `; max-age=${Math.ceil(ttlMs / 1000)}`;
        document.cookie = cookie;

        // เขียน storage ฝั่ง client
        try {
            const store =
                persistStorage === "local" ? localStorage : sessionStorage;
            store.setItem(key, JSON.stringify({ closedAt: now }));
        } catch { }

        onClose?.();
    };

    if (!open) return null;

    const pal = PALETTE[variant ?? "emergency"];
    const Icon = pal.icon;
    const pad = compact ? "py-1.5" : "py-2.5";
    const iconSize = compact ? "h-4 w-4" : "h-5 w-5";
    const tTitle = compact ? "text-[13px]" : "text-sm md:text-base";
    const tDesc = compact ? "text-xs" : "text-sm";

    return (
        <Alert className={cn("relative rounded-xl border shadow-sm", pal.bg, pal.border, pad, className)}>
            <div className="flex items-start gap-3">
                <Icon className={cn(iconSize, pal.title, "shrink-0 mt-0.5")} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                    <AlertTitle className={cn("font-semibold", pal.title, tTitle)}>
                        {title ?? (variant === "emergency" ? "ประกาศเร่งด่วน" : "ประกาศ")}
                    </AlertTitle>
                    <AlertDescription className={tDesc}>
                        <span>{message}</span>
                        {href && (
                            <>
                                <span className="mx-1.5">•</span>
                                <Link href={href} className="underline underline-offset-4 decoration-2 hover:opacity-90">
                                    ดูรายละเอียด
                                </Link>
                            </>
                        )}
                    </AlertDescription>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="ปิดประกาศ"
                    onClick={close}
                    className="shrink-0 hover:bg-foreground/5"
                >
                    <X className={iconSize} />
                </Button>
            </div>
        </Alert>
    );
}