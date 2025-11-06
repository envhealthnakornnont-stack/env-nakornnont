import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ServiceGrid from "./ServiceGrid";
import type { EServiceItem } from "./types";
import { normalizeEService } from "@/components/E-Service/utils";

type Props = {
    items: EServiceItem[];          // serializable only
    headingTitle?: string;
    headingDescription?: string;
    moreHref?: string;              // ปุ่ม “ดูทั้งหมด” ขวาบน
    className?: string;
};

export default function ServiceSection({
    items,
    headingTitle = "e-Service",
    headingDescription = "บริการออนไลน์ของสำนักสาธารณสุขและสิ่งแวดล้อม",
    moreHref = "/public-services",
    className,
}: Props) {
    const service = normalizeEService(items);
    const pillCount = service.length;
    return (
        <section className={cn("w-full", className)}>
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{headingTitle}</h2>
                        {headingDescription && (
                            <p className="mt-1 text-sm text-muted-foreground">{headingDescription}</p>
                        )}
                    </div>
                    {moreHref && (
                        <Button asChild variant="outline" className="hidden sm:inline-flex rounded-full">
                            <Link href={moreHref}>ดูทั้งหมด</Link>
                        </Button>
                    )}
                </div>

                {/* Grid */}
                <ServiceGrid items={service} label="บริการออนไลน์" subtitle="คลิกเพื่อเข้าใช้บริการ" />

                {/* ปุ่มท้ายกริดเป็น pill กลางช่อง */}
                {pillCount > 0 && (
                    <div className="mt-6 sm:mt-8 flex justify-center">
                        <Button
                            asChild
                            variant="secondary"
                            className="rounded-full px-6 py-5 text-base bg-muted/40 hover:bg-muted/60 border shadow-sm"
                        >
                            <Link href={moreHref}>แสดงเพิ่มเติม {pillCount} รายการ</Link>
                        </Button>
                    </div>
                )}

                {/* CTA (มือถือ) */}
                {moreHref && (
                    <div className="sm:hidden mt-6">
                        <Button asChild variant="outline" className="w-full">
                            <Link href={moreHref}>ดูทั้งหมด</Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
