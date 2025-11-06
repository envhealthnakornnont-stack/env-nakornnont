import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NewsCard from "./NewsCard";
import type { NewsGridProps } from "./types";
import { hrefFor } from "./utils";

// โหลดคอมโพเนนต์ client เฉพาะตอนใช้โหมด index
import dynamic from "next/dynamic";
const NewsGridIndexClient = dynamic(() => import("./NewsGridIndexClient"), { ssr: true });

export default function NewsGrid(props: NewsGridProps) {
  const {
    mode,
    type,
    items,
    title,
    viewAllHref,
    maxCards = 6,
    basePath,
    defaultPerPage = 12,
    className,
    breadcrumbs,
    serverTotal,
    serverPage,
    serverPageSize
  } = props;

  // โหมดหน้าแรก: SSR ล้วน ไม่มี "use client"
  if (mode === "home") {
    const list = (items ?? []).slice(0, maxCards);
    return (
      <section className={`mx-auto max-w-screen-xl my-6 md:my-12 px-4 md:px-6 ${className ?? ""}`}>
        {(title || viewAllHref) && (
          <div className="mb-4 md:mb-6 flex items-end justify-between gap-3">
            <div className="space-y-1">
              {title && <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>}
            </div>
            {viewAllHref && (
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href={viewAllHref}>ดูทั้งหมด</Link>
              </Button>
            )}
          </div>
        )}

        {list.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">ไม่พบข้อมูล</CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {list.map((item) => (
              <NewsCard key={item.id} item={item} type={type} href={hrefFor(type, item.id)} />
            ))}
          </div>
        )}
      </section>
    );
  }

  // โหมดหน้ารวม: เรียก Client Component (แต่ยังคง SSR shell ได้)
  return (
    <NewsGridIndexClient
      type={type}
      items={items}
      title={title ?? (type === "news" ? "ข่าวประชาสัมพันธ์" : "กิจกรรมของสำนัก")}
      basePath={basePath!}
      defaultPerPage={defaultPerPage}
      className={className}
      breadcrumbs={breadcrumbs}
      serverTotal={serverTotal}
      serverPage={serverPage}
      serverPageSize={serverPageSize}
    />
  );
}
