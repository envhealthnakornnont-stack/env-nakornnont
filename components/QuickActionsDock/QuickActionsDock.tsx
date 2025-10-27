import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { renderIcon } from "./Icons";
import { a11yLabel } from "./utils"; 
import type { QuickActionsDockProps } from "./types";

/**
 * SSR-first QuickActionsDock
 * - มือถือ: แนวนอนเลื่อนได้ + snap (CSS เท่านั้น)
 * - ≥sm: เปลี่ยนเป็นกริดนิ่ง
 * - Hover ยกการ์ดเฉพาะ ≥sm (ลด border กระพริบบน mobile)
 * - A11y: ใช้ <nav> + heading เดียว (เลี่ยง h2 ซ้ำ/ซ่อนเกินจำเป็น)
 */
export default function QuickActionsDock({
  items,
  title = "ทางลัดใช้งาน",
  subtitle,
  className,
  compact,
  id,
}: QuickActionsDockProps) {
  return (
    <nav
      id={id}
      aria-label={title}
      className={cn("mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12", className)}
    >
      {title && (
        <h2 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mb-3 text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}

      <Card className="p-3 md:p-4">
        <section>
          {/* mobile: แนวนอนเลื่อนได้ | ≥sm: กริดปกติ */}
          <ul
            role="list"
            className={cn(
              // มือถือเป็นแถวแนวนอน เลื่อนซ้าย-ขวา + snap
              "flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-2 px-2",
              // ซ่อนสกรอลบาร์แบบคร่าวๆ (ยังเลื่อนได้)
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              // ≥sm ให้เป็นกริดนิ่ง
              "sm:grid sm:overflow-visible sm:snap-none sm:mx-0 sm:px-0 sm:gap-3",
              "sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            )}
          >
            {items.map((item, i) => (
              <li
                key={i}
                className={cn(
                  "list-none",
                  // ให้การ์ดกว้างคงที่บนมือถือเพื่อเลื่อนสบาย + snap ทีละใบ
                  "flex-none w-[140px] sm:w-auto snap-start"
                )}
              >
                <Link
                  href={item.href}
                  aria-label={a11yLabel(item.label, item.href, item.ariaLabel, item.newTab)}
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
        </section>
      </Card>
    </nav>
  );
}
