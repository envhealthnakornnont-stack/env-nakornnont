"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import NewsCard from "./NewsCard";
import type { Crumb, Newsish } from "./types";
import { authorName, buildPageList, hrefFor, toPlainText } from "./utils";
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
    title: string;
    items: Newsish[];
    type: "news" | "activities";
    basePath: string;
    defaultPerPage?: number;
    className?: string;
    breadcrumbs?: Crumb[];
};

export default function NewsGridIndexClient({
    title, items, type, basePath, defaultPerPage = 12, className,
    breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: type === "news" ? "ข่าวประชาสัมพันธ์" : "กิจกรรมของสำนัก", current: true },
    ],
}: Props) {
    const router = useRouter();
    const sp = useSearchParams();

    const [q, setQ] = useState(sp.get("q") ?? "");
    const [sort, setSort] = useState<"new" | "old">(sp.get("sort") === "old" ? "old" : "new");
    const [perPage, setPerPage] = useState<number>(Number(sp.get("perPage")) || defaultPerPage);
    const [page, setPage] = useState<number>(Number(sp.get("page")) || 1);

    useEffect(() => {
        const params = new URLSearchParams(sp);
        q ? params.set("q", q) : params.delete("q");
        params.set("sort", sort);
        params.set("perPage", String(perPage));
        params.set("page", String(page));
        router.replace(`${basePath}?${params.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, sort, perPage, page]);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        let arr = [...items];
        if (term) {
            arr = arr.filter((it) => {
                const text = `${it.title} ${toPlainText(it.description ?? it.content)} ${authorName(it)}`.toLowerCase();
                return text.includes(term);
            });
        }
        arr.sort((a, b) => {
            const ad = a.createdAtISO ? new Date(a.createdAtISO).getTime() : 0;
            const bd = b.createdAtISO ? new Date(b.createdAtISO).getTime() : 0;
            return sort === "new" ? bd - ad : ad - bd;
        });
        return arr;
    }, [items, q, sort]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * perPage;
    const view = filtered.slice(start, start + perPage);
    const go = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

    return (
        <section className={cn("mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6", className)}>
            {/* Breadcrumb */}
            <Breadcrumb aria-label="Breadcrumb: เส้นทางหน้า">
                <BreadcrumbList className="overflow-x-auto whitespace-nowrap no-scrollbar">
                    {breadcrumbs.map((c, i) => (
                        <Fragment key={i}>
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
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header + Controls */}
            <div className="mt-3 mb-4 sm:mb-5 md:mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4">
                {/* Title */}
                <div className="space-y-1 md:flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{title}</h1>
                    <div className="h-px w-16 sm:w-24 bg-foreground/20" />
                </div>

                {/* Desktop controls */}
                <div className="hidden md:flex items-center gap-2">
                    <Input
                        value={q}
                        onChange={(e) => { setPage(1); setQ(e.target.value); }}
                        placeholder="ค้นหาข่าว..."
                        className="w-[220px] lg:w-[260px]"
                    />
                    <Select value={sort} onValueChange={(v: "new" | "old") => { setPage(1); setSort(v); }}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="เรียงตาม" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">ใหม่ล่าสุด</SelectItem>
                            <SelectItem value="old">เก่าที่สุด</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={String(perPage)}
                        onValueChange={(v) => { setPage(1); setPerPage(Number(v)); }}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="ต่อหน้า" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="9">9 ต่อหน้า</SelectItem>
                            <SelectItem value="12">12 ต่อหน้า</SelectItem>
                            <SelectItem value="18">18 ต่อหน้า</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Mobile controls */}
                <div className="md:hidden w-full space-y-2">
                    <Input
                        value={q}
                        onChange={(e) => { setPage(1); setQ(e.target.value); }}
                        placeholder="ค้นหาข่าว..."
                        className="w-full"
                    />
                    <div className="flex gap-2">
                        <Select value={sort} onValueChange={(v: "new" | "old") => { setPage(1); setSort(v); }}>
                            <SelectTrigger className="flex-1 min-w-0">
                                <SelectValue placeholder="เรียง" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">ใหม่ล่าสุด</SelectItem>
                                <SelectItem value="old">เก่าที่สุด</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={String(perPage)}
                            onValueChange={(v) => { setPage(1); setPerPage(Number(v)); }}
                        >
                            <SelectTrigger className="w-[128px]">
                                <SelectValue placeholder="ต่อหน้า" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                                <SelectItem value="18">18</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>


            {/* Grid */}
            {view.length === 0 ? (
                <Card className="border-dashed"><CardContent className="py-10 text-center text-muted-foreground">ไม่พบข้อมูล</CardContent></Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {view.map((item) => (
                        <NewsCard key={item.id} item={item} type={type} href={hrefFor(type, item.id)} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                    แสดง {view.length ? start + 1 : 0}–{Math.min(start + perPage, total)} จาก {total} รายการ
                </div>

                {/* มือถือ: แบบย่อ */}
                <div className="sm:hidden flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>ก่อนหน้า</Button>
                    <span className="text-xs text-muted-foreground">หน้า {currentPage}/{totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>ถัดไป</Button>
                </div>

                {/* ≥ sm: มีเลขหน้า + … */}
                <Pagination className="hidden sm:flex w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <Button aria-disabled={currentPage <= 1} variant="ghost" size="default" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}><ChevronLeft />ก่อนหน้า</Button>
                        </PaginationItem>
                        {buildPageList(currentPage, totalPages, 1).map((p, idx) => (
                            <PaginationItem key={`${p}-${idx}`}>
                                {p === "..." ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink isActive={p === currentPage} onClick={() => setPage(Number(p))} className="cursor-pointer">
                                        {p}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <Button aria-disabled={currentPage >= totalPages} variant="ghost" size="default" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>ถัดไป<ChevronRight /></Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </section>
    );
}
