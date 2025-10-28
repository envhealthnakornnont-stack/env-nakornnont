"use client";

import Image from "next/image";
import ShareMenu from "@/components/News/Content/ShareMenu2";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText } from "lucide-react";
import type { NewsArticle } from "./types";
import type { RelatedItem } from "@/components/News/Content/shared/related/types";
import { formatThaiDate, readMins, resolveImage } from "./utils";
import { useState } from "react";
import ImageLightbox from "@/components/News/Content/shared/lightbox/ImageLightbox";
import ContentWithLightbox from "@/components/News/Content/shared/lightbox/ContentWithLightbox";
import RelatedGrid from "@/components/News/Content/shared/related/RelatedGrid";

export default function NewsArticleModern({ item, related }: { item: NewsArticle; related?: RelatedItem[]; }) {
  const mins = readMins(item.contentHtml);
  const initials = item.author.email?.slice(0, 2).toUpperCase() || "NN";
  const [lbOpen, setLbOpen] = useState(false);
  const [lbSrc, setLbSrc] = useState<string | null>(null);
  const [lbAlt, setLbAlt] = useState<string>("");

  return (
    <article className="relative mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute inset-x-0 -top-12 z-0 h-48 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />

      {/* Header */}
      <header className="relative z-10 mt-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <h1 className="flex-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>
          <ShareMenu />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatThaiDate(item.createdAt)}</span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span>{mins} นาทีในการอ่าน</span>
          {item.tags?.length ? (
            <>
              <Separator orientation="vertical" className="hidden h-4 sm:block" />
              <div className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mt-5">
        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={resolveImage(item.hero?.src)}
                alt={item.hero?.alt || item.title}
                fill
                className="object-cover"
                priority
                onClick={() => {
                  setLbSrc(resolveImage(item.hero?.src));
                  setLbAlt(item.hero?.alt || item.title);
                  setLbOpen(true);
                }}
              />
            </AspectRatio>
          </CardContent>
        </Card>
        {item.hero?.credit ? (
          <p className="mt-2 text-xs text-muted-foreground">เครดิตภาพ: {item.hero.credit}</p>
        ) : null}
      </section>

      {/* Body Grid */}
      <div className="relative z-10 mt-8 grid gap-8 lg:grid-cols-12">
        {/* Main */}
        <section className="lg:col-span-8">
          <ContentWithLightbox html={item.contentHtml} />
        </section>

        {/* Aside */}
        <aside className="lg:col-span-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/60">
                  <AvatarImage src={item.author.avatar ?? undefined} />
                  <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.author.name}</p>
                  {item.author.department ? (
                    <p className="truncate text-xs text-muted-foreground">{item.author.department}</p>
                  ) : null}
                </div>
              </div>

              {item.attachments?.length ? (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm font-medium">เอกสารแนบ</p>
                    <ul className="mt-2 space-y-2">
                      {item.attachments.map((a) => (
                        <li key={a.url} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <a className="underline underline-offset-4 hover:opacity-80" href={a.url} target="_blank">
                            {a.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}

              {item.tags?.length ? (
                <>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
                    ))}
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Related (Mock) */}
      {related?.length ? (
        <RelatedGrid items={related} title="เนื้อหาที่เกี่ยวข้อง" />
      ) : null}
      <ImageLightbox open={lbOpen} onOpenChange={setLbOpen} src={lbSrc} alt={lbAlt} caption={null} />
    </article>
  );
}
