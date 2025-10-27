"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AuthorCard from "./AuthorCard";
import { estimateReadingMinutes, formatThaiDate, resolveImage } from "./utils";
import type { NewsArticle } from "./types";
import ShareMenu from "../ShareMenu";

export default function NewsArticle({ article }: { article: NewsArticle }) {
  const mins = estimateReadingMinutes(article.content);

  return (
    <article className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb วางนอก component นี้ตามเพจ */}
      {/* Title + Meta */}
      <header className="mt-4 sm:mt-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {article.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatThaiDate(article.createdAt)}</span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span>{mins} นาทีในการอ่าน</span>
          {article.tags?.length ? (
            <>
              <Separator orientation="vertical" className="hidden h-4 sm:block" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t) => (
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
      </header>

      {/* Hero Image */}
      <div className="mt-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={resolveImage(article.image)}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </AspectRatio>
          </CardContent>
        </Card>
      </div>

      {/* Author */}
      <section className="mt-6">
        <AuthorCard author={article.author} date={formatThaiDate(article.createdAt)} />
      </section>

      {/* Content */}
      <section className="prose prose-neutral dark:prose-invert prose-img:rounded-lg prose-hr:my-6 max-w-none mt-6">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </section>

      {/* Attachments (optional) */}
      {article.attachments?.length ? (
        <section className="mt-8">
          <h2 className="text-base font-semibold">เอกสารแนบ</h2>
          <ul className="mt-3 list-inside list-disc text-sm leading-7">
            {article.attachments.map((f) => (
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
