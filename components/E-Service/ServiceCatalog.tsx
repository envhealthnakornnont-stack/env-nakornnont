"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/ui/magic-card";
import { ShineBorder } from "@/components/ui/shine-border";
import type { E_Service } from "@/types/publicTypes";

type Props = {
  items: E_Service[];            // serializable อย่างเดียว
  label?: string;                // ป้ายบนการ์ด
  subtitle?: string;             // ข้อความรองบนการ์ด
  headingTitle?: string;
  headingDescription?: string;
  pageSize?: number;             // จำนวนต่อชุด
  className?: string;
};

export default function ServiceCatalog({
  items,
  label = "บริการออนไลน์",
  subtitle,
  headingTitle = "e-Service",
  headingDescription,
  pageSize = 12,
  className,
}: Props) {
  const [query, setQuery] = React.useState("");
  const [limit, setLimit] = React.useState(pageSize);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => x.title.toLowerCase().includes(q));
  }, [items, query]);

  const visible = filtered.slice(0, limit);
  const remain = Math.max(filtered.length - limit, 0);

  return (
    <section className={cn("w-full", className)}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ===== Header + Search ===== */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {headingTitle}
              </h1>
              {headingDescription && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {headingDescription}
                </p>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLimit(pageSize); // รีเซ็ต limit เมื่อค้นหา
                }}
                placeholder="ค้นหาชื่อบริการ…"
                className="pl-9"
              />
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              ทั้งหมด {filtered.length} รายการ
            </div>
          </div>
        </div>

        {/* ===== GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {visible.map((it) => (
            <Link
              key={it.id}
              href={it.linkURL}
              target="_blank"
              rel="noreferrer"
              className="group focus:outline-none"
            >
              <MagicCard
                className={cn(
                  "rounded-3xl p-[2px] bg-transparent shadow-none",
                  "[--m-gradient:radial-gradient(140px_140px_at_var(--m-x)_var(--m-y),theme(colors.fuchsia.300/.35),transparent_60%),radial-gradient(240px_240px_at_var(--m-x)_var(--m-y),theme(colors.sky.300/.25),transparent_60%)]",
                  "motion-reduce:[--m-gradient:transparent]"
                )}
              >
                <Card
                  className={cn(
                    "relative h-full rounded-3xl border-0",
                    "bg-muted/40 shadow-sm",
                    "p-5 sm:p-6 flex flex-col gap-4 sm:gap-5",
                    "transition-all hover:shadow-lg hover:bg-muted/50"
                  )}
                >
                  <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                  {/* ป้าย */}
                  <div>
                    <span className="inline-flex items-center rounded-full bg-background text-muted-foreground border px-2.5 py-1 text-[11px] font-medium">
                      {label}
                    </span>
                  </div>

                  {/* ชื่อ + คำอธิบาย */}
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

                  {/* ลูกศร */}
                  <div className="pt-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background border transition-transform group-hover:translate-x-1" aria-hidden>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </MagicCard>
            </Link>
          ))}

          {/* ปุ่ม Load more เป็นช่องสุดท้ายของกริด */}
          {remain > 0 && (
            <div className="h-full">
              <div className="h-full flex items-center justify-center">
                <Button
                  variant="secondary"
                  className="rounded-full px-6 py-5 text-base bg-muted/40 hover:bg-muted/60 border shadow-sm"
                  onClick={() => setLimit((n) => n + pageSize)}
                >
                  แสดงเพิ่มเติม {remain} รายการ
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* สรุปจำนวน (มือถือ) */}
        <div className="sm:hidden mt-6 text-center text-sm text-muted-foreground">
          ทั้งหมด {filtered.length} รายการ
        </div>
      </div>
    </section>
  );
}
