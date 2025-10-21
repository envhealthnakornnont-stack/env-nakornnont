"use client";

import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import * as React from "react";

type Item = { url: string; title: string; thumbnail: string };

type Props = {
    items: Item[];
    title?: string;        // หัวข้อที่จะแสดงด้านบน (แนะนำใส่)
    subtitle?: string;     // คำอธิบายสั้นๆ ใต้หัวข้อ (ตัวเลือก)
    size?: "md" | "lg";    // ปรับความสูงรูป: md=เดิม, lg=ใหญ่ขึ้น
    durationMs?: number;   // ความเร็วเลื่อน (ค่าเริ่มต้น ~30s)
    className?: string;
    unoptimized?: boolean; // ตั้ง true ถ้ายังไม่ได้ whitelist โดเมน TikTokCDN
};

export default function TikTokMarqueeClient({
    items,
    title = "วิดีโอกิจกรรม (TikTok)",
    subtitle,
    size = "lg",
    durationMs = 30000,
    className,
    unoptimized = true,
}: Props) {
    // map ขนาดรูป
    const imgH = size === "lg" ? "h-28 md:h-40" : "h-20 md:h-24";
    const gap = "2.0rem"; // ระยะห่างระหว่างการ์ด

    return (
        <section className={className}>
            {/* หัวข้อ + คำอธิบาย */}
            <div className="mx-auto">
                <h2 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
                {subtitle && (
                    <p className="mt-1 text-xs md:text-sm text-muted-foreground">{subtitle}</p>
                )}
            </div>

            {/* แถบวิ่ง */}
            <div
                className="mx-auto mt-3 rounded-2xl border bg-muted/20 p-2 md:p-3"
                style={
                    {
                        // ให้ Marquee ของ Magic UI ใช้ตัวแปรพวกนี้
                        "--gap": gap,
                        "--duration": `${Math.max(8000, durationMs)}ms`,
                    } as React.CSSProperties
                }
            >
                <Marquee pauseOnHover className="py-2 md:py-3 motion-reduce:animate-none">
                    {items.map((it, i) => (
                        <Link
                            key={i}
                            href={it.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`เปิดดูบน TikTok: ${it.title}`}
                            className="mx-3 group relative inline-flex items-center rounded-xl overflow-hidden ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <Image
                                src={it.thumbnail}
                                alt={it.title}
                                width={480}
                                height={270}
                                className={`${imgH} w-auto object-cover transition-opacity group-hover:opacity-90`}
                                unoptimized={unoptimized}
                            />
                            <span className="pointer-events-none absolute right-1.5 bottom-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                                เปิดบน TikTok
                            </span>
                        </Link>
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="py-2 md:py-3 motion-reduce:animate-none">
                    {items.map((it, i) => (
                        <Link
                            key={i}
                            href={it.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`เปิดดูบน TikTok: ${it.title}`}
                            className="mx-3 group relative inline-flex items-center rounded-xl overflow-hidden ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <Image
                                src={it.thumbnail}
                                alt={it.title}
                                width={480}
                                height={270}
                                className={`${imgH} w-auto object-cover transition-opacity group-hover:opacity-90`}
                                unoptimized={unoptimized}
                            />
                            <span className="pointer-events-none absolute right-1.5 bottom-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                                เปิดบน TikTok
                            </span>
                        </Link>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}
