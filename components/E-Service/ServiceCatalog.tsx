"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ServiceGrid from "./ServiceGrid";
import { filterByQuery, normalizeEService } from "./utils";
import type { EServiceItem, Crumb } from "./types";

type Props = {
  items: EServiceItem[];
  breadcrumbs?: Crumb[];
  label?: string;
  subtitle?: string;
  headingTitle?: string;
  headingDescription?: string;
  pageSize?: number;
  className?: string;
};

export default function ServiceCatalog({
  items,
  breadcrumbs = [{ label: "หน้าแรก", href: "/" }, { label: "e-Service", current: true }],
  label = "บริการออนไลน์",
  subtitle = "คลิกเพื่อเข้าใช้บริการ",
  headingTitle = "e-Service ทั้งหมด",
  headingDescription,
  pageSize = 12,
  className,
}: Props) {
  const service = normalizeEService(items);
  const [query, setQuery] = React.useState("");
  const [limit, setLimit] = React.useState(pageSize);

  const filtered = React.useMemo(() => filterByQuery(service, query), [service, query]);
  const visible = filtered.slice(0, limit);
  const remain = Math.max(filtered.length - limit, 0);

  return (
    <section className={cn("w-full", className)}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb aria-label="Breadcrumb: เส้นทางหน้า">
          <BreadcrumbList className="overflow-x-auto whitespace-nowrap no-scrollbar">
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem>
                  {c.current ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={c.href ?? "#"}>{c.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header + Search */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{headingTitle}</h1>
            {headingDescription && (
              <p className="mt-1 text-sm text-muted-foreground">{headingDescription}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setLimit(pageSize); }}
                placeholder="ค้นหาชื่อบริการ…"
                className="pl-9"
              />
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              ทั้งหมด {filtered.length} รายการ
            </div>
          </div>
        </div>

        {/* Grid */}
        <ServiceGrid items={visible} label={label} subtitle={subtitle} />

        {/* Load more ช่องท้าย */}
        {remain > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Button
              variant="secondary"
              className="rounded-full px-6 py-5 text-base bg-muted/40 hover:bg-muted/60 border shadow-sm"
              onClick={() => setLimit(n => n + pageSize)}
            >
              แสดงเพิ่มเติม {remain} รายการ
            </Button>
          </div>
        )}

        {/* สรุปจำนวน (มือถือ) */}
        <div className="sm:hidden text-center text-sm text-muted-foreground">
          ทั้งหมด {filtered.length} รายการ
        </div>
      </div>
    </section>
  );
}
