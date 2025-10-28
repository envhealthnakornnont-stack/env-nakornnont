"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RelatedItem } from "../../related/utils";

export default function RelatedGrid({
  items,
  title = "เนื้อหาที่เกี่ยวข้อง",
  className,
}: { items: RelatedItem[]; title?: string; className?: string }) {
  if (!items?.length) return null;

  return (
    <section className={cn("relative z-10 mt-10", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <a key={it.id} href={it.href}>
            <Card className="group overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="p-0">
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={it.image || "/demo/placeholder-16x9.jpg"}
                      alt={it.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </AspectRatio>
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-medium">{it.title}</p>
                    {it.subtitle ? (
                      <p className="mt-1 text-xs text-muted-foreground">{it.subtitle}</p>
                    ) : null}
                    {it.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {it.tags.slice(0, 3).map((t) => (
                          <Badge key={t} variant="secondary" className="rounded-full text-[10px]">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
