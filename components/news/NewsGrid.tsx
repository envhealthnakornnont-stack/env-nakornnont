import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Newsish = {
    id: string;
    title: string;
    slug: string;
    image?: string | null;
    description?: string | null;
    content?: any; // Quill Delta หรือ HTML string
    author?: { firstname?: string; lastname?: string; department?: string };
    createdAt: string; // แปลงไทยจากฝั่ง fetch มาแล้วก็ได้
};

type Props = {
    items: Newsish[];
    type: "news" | "activities";
    title?: string;               // ชื่อส่วนหัว
    viewAllHref?: string;         // ลิงก์ "ดูทั้งหมด"
    maxCards?: number;            // ค่าเริ่มต้น 6
    className?: string;
};

const fallbackImg = "/default-news.jpg";
const resolveImagePath = (img?: string | null) => {
    if (!img) return fallbackImg;
    if (img.startsWith("/uploads")) return `/api/uploads${img}`;
    return img;
};

function toPlainText(input: unknown): string {
    if (typeof input === "string") {
        // ตัด HTML ทิ้งกรณี content เป็น string HTML
        return input.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    }
    try {
        const obj: any = input;
        if (obj?.ops && Array.isArray(obj.ops)) {
            return obj.ops.map((op: any) => (typeof op.insert === "string" ? op.insert : "")).join("").trim();
        }
    } catch { }
    return "";
}

function truncate(str: string, max = 120) {
    if (!str) return "";
    return str.length <= max ? str : str.slice(0, max).trimEnd() + "…";
}

function byline(item: Newsish) {
    const fn = item.author?.firstname ?? "";
    const ln = item.author?.lastname ?? "";
    const name = `${fn}${fn && ln ? " " : ""}${ln}`.trim();
    const dept = item.author?.department ? ` • ${item.author.department}` : "";
    return name ? `${name}${dept}` : dept.slice(3);
}

function hrefFor(type: "news" | "activities", id: string) {
    return type === "news" ? `/news/news-updates/${id}` : `/news/activities/${id}`;
}

function authorName(item: Newsish) {
    const fn = (item.author?.firstname ?? "").trim();
    const ln = (item.author?.lastname ?? "").trim();
    return fn || ln ? `${fn}${fn && ln ? " " : ""}${ln}` : "";
}

export default function NewsGrid({
    items,
    type,
    title,
    viewAllHref,
    maxCards = 6,
    className,
}: Props) {
    const list = (items ?? []).slice(0, maxCards);

    return (
        <section className={cn("mx-auto max-w-screen-xl my-6 md:my-12 px-4 md:px-6", className)}>
            {/* Header */}
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

            {/* Grid */}
            {list.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-10 text-center text-muted-foreground">ไม่พบข้อมูล</CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {list.map((item) => (
                        <Card
                            key={item.id}
                            className="group overflow-hidden border-muted/60 hover:border-foreground/30 transition-colors"
                        >
                            <Link href={hrefFor(type, item.id)} aria-label={item.title} className="block h-full">
                                {/* ทำคอลัมน์เต็มใบ เพื่อดัน meta ลงล่างได้ */}
                                <div className="flex h-full flex-col">
                                    {/* ภาพด้านบน */}
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <Image
                                            src={resolveImagePath(item.image)}
                                            alt={item.title}
                                            fill
                                            sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute left-3 top-3">
                                            <Badge variant={type === "news" ? "default" : "secondary"} className="backdrop-blur-sm rounded-full">
                                                {type === "news" ? "ข่าวประชาสัมพันธ์" : "กิจกรรม"}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* เนื้อหา + เมตา (เมตาอยู่ล่างสุดด้วย mt-auto) */}
                                    <div className="flex flex-1 flex-col">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="line-clamp-2 leading-snug text-balance">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>

                                        {/* ดัน meta ลงล่างด้วย mt-auto */}
                                        <CardContent className="pt-0 mt-auto pb-4">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {truncate(toPlainText(item.description ?? item.content) || "", 140)}
                                            </p>

                                            {/* meta row */}
                                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                                                <span className="whitespace-nowrap">{item.createdAt}</span>
                                                {authorName(item) && (
                                                    <>
                                                        <span aria-hidden className="hidden sm:inline">•</span>
                                                        <span className="truncate">{authorName(item)}</span>
                                                        {/* ถ้าอยากโชว์หน่วยงานเฉพาะเดสก์ท็อป: */}
                                                        {/* <span className="hidden lg:inline">{item.author?.department ? ` • ${item.author.department}` : ""}</span> */}
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </div>
                                </div>
                            </Link>
                        </Card>

                    ))}
                </div>
            )}
        </section>
    );
}