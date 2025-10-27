import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authorName, resolveImagePath, toPlainText, truncate } from "./utils";

export default function NewsCard({
  item, type, href,
}: { item: any; type: "news" | "activities"; href: string }) {
  return (
    <Card className="group overflow-hidden border-muted/60 hover:border-foreground/30 transition-colors">
      <Link href={href} aria-label={item.title} className="block h-full">
        <div className="flex h-full flex-col">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={resolveImagePath(item.image)}
              alt={item.title}
              fill
              sizes="(min-width:1280px) 400px, (min-width:768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3">
              <Badge variant={type === "news" ? "default" : "secondary"} className="backdrop-blur-sm rounded-full">
                {type === "news" ? "ข่าวประชาสัมพันธ์" : "กิจกรรม"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 leading-snug text-balance">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 mt-auto pb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {truncate(toPlainText(item.description ?? item.content) || "", 140)}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                <span className="whitespace-nowrap">{item.createdAt}</span>
                {authorName(item) && (
                  <>
                    <span aria-hidden className="hidden sm:inline">•</span>
                    <span className="truncate">{authorName(item)}</span>
                  </>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </Link>
    </Card>
  );
}