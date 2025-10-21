"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import * as React from "react";
import { CalendarDays, Megaphone, PanelsTopLeft, Newspaper } from "lucide-react";

export type QuickActionItem = {
    href: string;
    label: string;
    icon?: React.ReactNode;
    src?: string;
    alt?: string;
    newTab?: boolean;
    ariaLabel?: string;
};

type Props = {
    items: QuickActionItem[];
    title?: string;
    subtitle?: string;
    className?: string;
    compact?: boolean;
};

export default function QuickActionsDock({ items, title = "ทางลัดใช้งาน", subtitle, className, compact }: Props) {
    return (
        <section aria-label={title} className={cn("mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12", className)}>
            {title && (
                <h2 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight">
                    {title}
                </h2>
            )}
            {title && (
                <h2 className="sr-only">{title}</h2> // เวอร์ชันสำหรับมือถือ/ผู้อ่านหน้าจอ
            )}
            {subtitle && (
                <p className="mb-2 text-sm text-muted-foreground">
                    {subtitle}
                </p>
            )}
            <Card className="p-3 md:p-4">
                {/* mobile: แนวนอนเลื่อนได้ | ≥sm: ใช้กริดปกติ */}
                <ul
                    role="list"
                    className={cn(
                        // มือถือเป็นแถวแนวนอน เลื่อนซ้าย-ขวา + snap
                        "flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-2 px-2",
                        // ซ่อนสกรอลบาร์แบบคร่าวๆ (ยังเลื่อนได้)
                        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                        // ตั้งค่าที่จอ ≥ sm ให้เป็นกริดนิ่ง
                        "sm:grid sm:overflow-visible sm:snap-none sm:mx-0 sm:px-0 sm:gap-3",
                        "sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    )}
                >
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className={cn(
                                "list-none",
                                // ให้แต่ละการ์ดมีความกว้างแน่นอนบนมือถือเพื่อเลื่อนสบาย + snap ทีละใบ
                                "flex-none w-[140px] sm:w-auto snap-start"
                            )}
                        >
                            <Link
                                href={item.href}
                                aria-label={item.ariaLabel ?? item.label}
                                {...(item.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                className={cn(
                                    "group flex flex-col items-center justify-center rounded-xl border bg-card text-card-foreground",
                                    "h-24 sm:h-28 md:h-32 px-3 md:px-4",
                                    "transition-transform duration-150 sm:hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                )}
                            >
                                {/* ไอคอน */}
                                <div className={cn("mb-2 md:mb-3 flex items-center justify-center")}>
                                    {renderIcon(item, compact)}
                                </div>

                                {/* ป้ายชื่อ */}
                                <span className={cn("text-center font-medium tracking-tight", compact ? "text-xs" : "text-sm")}>
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>
        </section>
    );
}

/** ให้ไอคอน "เห็นแน่" โดยบังคับขนาด/สีเข้าที่ element จริง */
function renderIcon(item: QuickActionItem, compact?: boolean) {
    if (item.src) {
        return (
            <img
                src={item.src}
                alt={item.alt ?? item.label}
                width={compact ? 28 : 36}
                height={compact ? 28 : 36}
                className="opacity-90 group-hover:opacity-100"
                loading="lazy"
                decoding="async"
            />
        );
    }

    if (item.icon && React.isValidElement(item.icon)) {
        // รวม class เดิมของผู้ใช้ + บังคับขนาด/สีที่ตัวไอคอน (lucide ใช้ stroke-current)
        const forced = cn(compact ? "h-6 w-6" : "h-8 w-8", "text-foreground opacity-90 group-hover:opacity-100");
        return React.cloneElement(item.icon as React.ReactElement<any>, {
            className: cn(forced, (item.icon as React.ReactElement<any>).props?.className),
            "aria-hidden": true,
        });
    }

    return null;
}

/* ===== ไอคอน preset (เผื่อเรียกใช้เร็ว) ===== */
export const PresetIcons = {
    Complaint: <Megaphone />,
    EService: <PanelsTopLeft />,
    News: <Newspaper />,
    Calendar: <CalendarDays />,
};
