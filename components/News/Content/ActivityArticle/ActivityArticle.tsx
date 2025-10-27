"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MapPin, Building2 } from "lucide-react";
import { formatThaiDateTime, resolveUpload } from "./utils";
import type { ActivityArticle } from "./types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import ShareMenu from "../ShareMenu";

export default function ActivityArticle({ item }: { item: ActivityArticle }) {
    return (
        <article className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <header className="mt-4 sm:mt-6">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    {item.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatThaiDateTime(item.createdAt)}</span>
                    {item.tags?.length ? (
                        <>
                            <Separator orientation="vertical" className="hidden h-4 sm:block" />
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map((t) => (
                                    <Badge key={t} variant="secondary" className="rounded-full">
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        </>
                    ) : null}
                    <div className="ml-auto">
                        <ShareMenu />
                    </div>
                </div>

                {/* Meta rows: สถานที่ / ผู้จัด */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {item.location ? (
                        <div className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-muted-foreground">{item.location}</span>
                        </div>
                    ) : null}
                    {item.organizer ? (
                        <div className="inline-flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span className="text-muted-foreground">{item.organizer}</span>
                        </div>
                    ) : null}
                </div>
            </header>

            {/* Gallery */}
            {item.gallery?.length ? (
                <section className="mt-4">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative">
                                <Carousel className="w-full">
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
                                                    />
                                                </AspectRatio>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            ) : null}

            {/* Content */}
            <section className="prose prose-neutral dark:prose-invert prose-img:rounded-lg prose-hr:my-6 max-w-none mt-6">
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </section>

            {/* Attachments */}
            {item.attachments?.length ? (
                <section className="mt-8">
                    <h2 className="text-base font-semibold">เอกสารแนบ</h2>
                    <ul className="mt-3 list-inside list-disc text-sm leading-7">
                        {item.attachments.map((f) => (
                            <li key={f.url}>
                                <a className="underline underline-offset-4 hover:opacity-80" href={f.url} target="_blank">
                                    {f.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </article>
    );
}
