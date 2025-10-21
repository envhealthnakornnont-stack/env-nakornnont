"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CircleAlert, Info, CheckCircle2, X } from "lucide-react";

type Variant = "emergency" | "warning" | "info" | "success";
type StorageMode = "session" | "local";

type Props = {
  message: string;
  title?: string;
  href?: string;
  className?: string;
  variant?: Variant;
  sticky?: boolean;           // ติดใต้ navbar
  navbarHeight?: number;      // px, ดีฟอลต์ 64
  compact?: boolean;
  /** กำหนดรหัสประกาศ (เช่น pm25-2025-10-18) เปลี่ยนเมื่อมีประกาศใหม่ */
  persistId?: string;
  /** ใช้ sessionStorage (ต่อแท็บ) หรือ localStorage (ทั้งเบราว์เซอร์) */
  persistStorage?: StorageMode;  // ดีฟอลต์ "session"
  /** ระยะเวลาจำการปิด (ms) เช่น 6 ชั่วโมง = 6*60*60*1000; ไม่ใส่ = แสดงทุกครั้งเมื่อโหลดใหม่ */
  ttlMs?: number;
  onClose?: () => void;
};

const PALETTE: Record<
  Variant,
  {
    icon: React.ElementType;
    // พื้นหลัง “ทึบ” สำหรับ light/dark
    bg: string;
    border: string;
    title: string;
  }
> = {
  emergency: {
    icon: AlertTriangle,
    bg: "bg-red-50 dark:bg-red-900",
    border: "border-red-200 dark:border-red-800",
    title: "text-red-800 dark:text-red-100",
  },
  warning: {
    icon: CircleAlert,
    bg: "bg-amber-50 dark:bg-amber-900",
    border: "border-amber-200 dark:border-amber-800",
    title: "text-amber-800 dark:text-amber-100",
  },
  info: {
    icon: Info,
    bg: "bg-sky-50 dark:bg-sky-900",
    border: "border-sky-200 dark:border-sky-800",
    title: "text-sky-800 dark:text-sky-100",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-900",
    border: "border-emerald-200 dark:border-emerald-800",
    title: "text-emerald-800 dark:text-emerald-100",
  },
};

export default function EmergencyBanner({
  message,
  title,
  href = "/announcements",
  className,
  variant = "emergency",
  sticky = true,
  navbarHeight = 64,
  compact = false,
  persistId,
  persistStorage = "session",
  ttlMs,
  onClose,
}: Props) {
  const [open, setOpen] = React.useState(true);

  // โหลดสถานะปิด (แบบ session หรือ local + TTL)
  React.useEffect(() => {
    if (!persistId) return;
    const store = persistStorage === "local" ? window.localStorage : window.sessionStorage;
    try {
      const raw = store.getItem(`banner:${persistId}`);
      if (!raw) return;
      const obj = JSON.parse(raw) as { closedAt: number };
      if (!ttlMs || Date.now() - obj.closedAt < ttlMs) setOpen(false);
      else store.removeItem(`banner:${persistId}`);
    } catch {}
  }, [persistId, persistStorage, ttlMs]);

  const handleClose = () => {
    setOpen(false);
    if (persistId) {
      const store = persistStorage === "local" ? window.localStorage : window.sessionStorage;
      try {
        store.setItem(`banner:${persistId}`, JSON.stringify({ closedAt: Date.now() }));
      } catch {}
    }
    onClose?.();
  };

  if (!open) return null;

  const pal = PALETTE[variant];
  const Icon = pal.icon;
  const pad = compact ? "py-1.5" : "py-2.5";
  const iconSize = compact ? "h-4 w-4" : "h-5 w-5";
  const tTitle = compact ? "text-[13px]" : "text-sm md:text-base";
  const tDesc = compact ? "text-xs" : "text-sm";

  return (
    <div
      className={cn("z-40 w-full", sticky && "sticky", className)}
      style={{ top: sticky ? navbarHeight : undefined }} // ติดใต้ navbar 64px
      role={variant === "emergency" ? "alert" : "status"}
      aria-live={variant === "emergency" ? "assertive" : "polite"}
    >
      <div className="mx-auto max-w-screen-xl px-4">
        <Alert
          className={cn(
            "relative rounded-xl border shadow-sm",
            pal.bg,
            pal.border,
            pad
          )}
        >
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
              onClick={handleClose}
              className="shrink-0 hover:bg-foreground/5"
            >
              <X className={iconSize} />
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
}
