import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { E_Service } from "@/types/publicTypes";
import { MagicCard } from "@/components/ui/magic-card";
import { ShineBorder } from "@/components/ui/shine-border";

type Props = {
    items: E_Service[];
    // ป้ายเล็กบนการ์ด
    label?: string;
    // ข้อความย่อยในการ์ด
    subtitle?: string;

    // ส่วนหัว
    headingTitle?: string;        // เริ่มต้น: "e-Service"
    headingDescription?: string;  // เริ่มต้น: "บริการออนไลน์ของสำนักสาธารณสุขและสิ่งแวดล้อม"
    headingCtaHref?: string;      // ถ้าให้ href จะมีปุ่มขวา "ดูทั้งหมด"
    headingCtaText?: string;      // เริ่มต้น: "ดูทั้งหมด"

    // ปุ่มท้ายกริด
    showMoreCount?: number;
    onMoreHref?: string;

    className?: string;
};

export default function ServiceModern({
    items,
    label = "บริการออนไลน์",
    subtitle,
    headingTitle = "e-Service",
    headingDescription = "บริการออนไลน์ของสำนักสาธารณสุขและสิ่งแวดล้อม",
    showMoreCount,
    onMoreHref = "/public-services",
    className,
}: Props) {
    return (
        <section className={cn("w-full", className)}>
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                {/* ===== Header ===== */}
                <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            {headingTitle}
                        </h2>
                        {headingDescription && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {headingDescription}
                            </p>
                        )}
                    </div>
                    {/* ปุ่มแสดงเพิ่มเติม: ช่องสุดท้ายของกริด */}
                    {typeof showMoreCount === "number" && showMoreCount > 0 && (
                        <div className="h-full hidden sm:inline-flex">
                            <div className="h-full flex items-center justify-center">
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="rounded-full px-6 py-5 text-base bg-muted/40 hover:bg-muted/60 border shadow-sm"
                                >
                                    <Link href={onMoreHref}>
                                        แสดงเพิ่มเติม
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== GRID การ์ด ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {items.map((it) => (
                        <Link
                            key={it.id}
                            href={it.linkURL}
                            target="_blank"
                            rel="noreferrer"
                            className="group focus:outline-none"
                        >
                            <MagicCard className={cn(
                                // กำหนดฮาโลตามเมาส์ (ใช้ตัวแปร CSS ของ MagicCard)
                                "rounded-3xl p-[2px] bg-transparent shadow-none",
                                // ปรับเฉดฮาโลตามธีม: ชมพู→ม่วง→ฟ้า
                                "[--m-gradient:radial-gradient(120px_120px_at_var(--m-x)_var(--m-y),theme(colors.fuchsia.300/.35),transparent_60%),radial-gradient(200px_200px_at_var(--m-x)_var(--m-y),theme(colors.sky.300/.25),transparent_60%)]",
                                // ลดเอฟเฟกต์เมื่อผู้ใช้เปิด reduce-motion
                                "motion-reduce:[--m-gradient:transparent]"
                            )}>
                                <Card
                                    className={cn(
                                        "relative h-full rounded-3xl border-0",
                                        "bg-muted/40 shadow-sm",
                                        "p-5 sm:p-6 flex flex-col gap-4 sm:gap-5",
                                        "transition-all hover:shadow-lg hover:bg-muted/50"
                                    )}
                                >
                                    <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                                    {/* ป้ายมุมซ้ายบน */}
                                    <div>
                                        <span className="inline-flex items-center rounded-full bg-background text-muted-foreground border px-2.5 py-1 text-[11px] font-medium">
                                            {label}
                                        </span>
                                    </div>

                                    {/* หัวเรื่อง + คำอธิบายสั้น */}
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-semibold leading-snug tracking-tight text-foreground">
                                            {it.title}
                                        </h3>
                                        {subtitle && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>

                                    {/* ลูกศรล่างซ้าย */}
                                    <div className="pt-2">
                                        <span
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background border transition-transform group-hover:translate-x-1"
                                            aria-hidden
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </Card>
                            </MagicCard>
                        </Link>
                    ))}

                    {/* ปุ่มแสดงเพิ่มเติม: ช่องสุดท้ายของกริด */}
                    {typeof showMoreCount === "number" && showMoreCount > 0 && (
                        <div className="h-full sm:hidden">
                            <div className="h-full flex items-center justify-center">
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="rounded-full px-6 py-5 text-base bg-muted/40 hover:bg-muted/60 border shadow-sm"
                                >
                                    <Link href={onMoreHref}>
                                        แสดงเพิ่มเติม
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
