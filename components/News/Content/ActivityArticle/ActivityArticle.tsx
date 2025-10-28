"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ShareMenu from "@/components/News/Content/ShareMenu2";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MapPin, Building2, Images, FileText } from "lucide-react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Activity } from "./types";
import { formatThaiDateTime, resolveUpload } from "./utils";
import ContentWithLightbox from "@/components/News/Content/shared/lightbox/ContentWithLightbox";
import RelatedGrid from "@/components/News/Content/shared/related/RelatedGrid";
import { RelatedItem } from "@/components/News/Content/shared/related/types";
import ImageLightbox from "@/components/News/Content/shared/lightbox/ImageLightbox";

export default function ActivityArticleModern({ item, related }: { item: Activity, related?: RelatedItem[]}) {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(0);
    const [showHint, setShowHint] = useState(true);

    const [lbOpen, setLbOpen] = useState(false);
    const [lbSrc, setLbSrc] = useState<string | null>(null);
    const [lbAlt, setLbAlt] = useState<string>("");

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        const onSelect = () => {
            setIndex(api.selectedScrollSnap());
            setShowHint(false);
        };
        api.on("select", onSelect);
        api.on("pointerDown", () => setShowHint(false));
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    const initials =
        item.author?.email?.slice(0, 2).toUpperCase() ||
        item.author?.name?.slice(0, 2).toUpperCase() || "AU";

    return (
        <article className="relative mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-x-0 -top-12 z-0 h-48 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent blur-2xl" />

            {/* Header */}
            <header className="relative z-10 mt-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <h1 className="flex-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        {item.title}
                    </h1>
                    <ShareMenu />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span>{formatThaiDateTime(item.createdAt)}</span>
                    {item.location ? (
                        <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {item.location}
                        </span>
                    ) : null}
                    {item.organizer ? (
                        <span className="inline-flex items-center gap-1">
                            <Building2 className="h-4 w-4" /> {item.organizer}
                        </span>
                    ) : null}
                    {item.tags?.length ? (
                        <div className="inline-flex flex-wrap gap-2">
                            {item.tags.map((t) => (
                                <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
                            ))}
                        </div>
                    ) : null}
                </div>
            </header>

            {/* Gallery */}
            {item.gallery?.length ? (
                <section className="relative z-10 mt-5">
                    <Card className="overflow-hidden shadow-sm">
                        <CardContent className="p-0">
                            <div className="relative">
                                <Carousel className="w-full" setApi={setApi}>
                                    <CarouselContent>
                                        {item.gallery.map((g, i) => (
                                            <CarouselItem key={i}>
                                                <AspectRatio ratio={16 / 9}>
                                                    <Image
                                                        src={resolveUpload(g.src)}
                                                        alt={g.alt || `ภาพกิจกรรม ${i + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        priority={i === 0}
                                                        onClick={() => {
                                                            setLbSrc(resolveUpload(g.src));
                                                            setLbAlt(g.alt || `ภาพกิจกรรม ${i + 1}`);
                                                            setLbOpen(true);
                                                        }}
                                                    />
                                                </AspectRatio>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    {/* ปุ่มเลื่อน */}
                                    <CarouselPrevious />
                                    <CarouselNext />

                                    {/* Hint overlay: บอกผู้ใช้ว่าเลื่อนได้ */}
                                    {showHint ? (
                                        <div
                                            className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-max rounded-full bg-background/80 px-3 py-1 text-xs text-foreground shadow"
                                            aria-hidden="true"
                                        >
                                            ปัดเพื่อเลื่อนรูป →
                                        </div>
                                    ) : null}
                                </Carousel>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Indicators */}
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                            <Images className="h-3.5 w-3.5" /> แกลเลอรี่ {item.gallery.length} ภาพ
                        </p>
                        {count > 1 ? (
                            <div className="flex items-center gap-1">
                                {Array.from({ length: count }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full ${index === i ? "bg-foreground" : "bg-muted"
                                            }`}
                                        aria-label={`สไลด์ ${i + 1}`}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>
            ) : null}

            {/* Body */}
            <div className="relative z-10 mt-8 grid gap-8 lg:grid-cols-12">
                <section className="lg:col-span-8">
                    <ContentWithLightbox html={item.contentHtml} />
                </section>

                {/* Aside Card: ✅ เพิ่ม Author + Tags */}
                <aside className="lg:col-span-4">
                    <Card>
                        <CardContent className="p-5 space-y-4">
                            {/* Author */}
                            {item.author ? (
                                <div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <Avatar className="h-10 w-10 ring-2 ring-primary/60">
                                            <AvatarImage src={item.author.avatar ?? undefined} />
                                            <AvatarFallback className="text-xs font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">{item.author.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.author.department || item.organizer || "สำนักสาธารณสุขฯ"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Info */}
                            <div>
                                <p className="text-sm font-medium">ข้อมูลกิจกรรม</p>
                                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{item.location || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        <span>{item.organizer || "—"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments */}
                            {item.attachments?.length ? (
                                <div>
                                    <Separator className="my-4" />
                                    <p className="text-sm font-medium">เอกสารแนบ</p>
                                    <ul className="mt-2 space-y-2 text-sm">
                                        {item.attachments.map((a) => (
                                            <li key={a.url} className="flex items-center gap-2 text-sm">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <a
                                                    className="underline underline-offset-4 hover:opacity-80"
                                                    href={a.url}
                                                    target="_blank"
                                                >
                                                    {a.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {/* Tags */}
                            {item.tags?.length ? (
                                <div>
                                    <Separator className="my-4" />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {item.tags.map((t) => (
                                            <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </aside>
            </div>

            {related?.length ? <RelatedGrid items={related} title="กิจกรรมที่เกี่ยวข้อง" /> : null}
            <ImageLightbox open={lbOpen} onOpenChange={setLbOpen} src={lbSrc} alt={lbAlt} caption={null} />
        </article>
    );
}
