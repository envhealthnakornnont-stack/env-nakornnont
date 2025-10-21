// components/news/BentoPresetA.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Item = {
    title: string;
    href: string;
    image?: string | null;
    kicker?: string;
    description?: string;
};

type Props = {
    hero: Item;
    rightTop: Item;
    rightBottom: Item;
    className?: string;

    /** หัวข้อส่วนบน */
    headingTitle?: string;                 // default: "ไฮไลท์ข่าวและกิจกรรม"
    headingSubtitle?: string;              // ไม่บังคับ
    headingCtaHref?: string;               // ลิงก์ "ดูทั้งหมด" (ถ้ามี)
    headingCtaLabel?: string;              // default: "ดูทั้งหมด"
    headingIcon?: React.ReactNode;         // ไอคอน (ถ้ามี)
};

const fallbackImg = "/default-news.jpg";

const resolveImagePath = (img: string | null | undefined) => {
    if (!img) return "/default-news.png";
    if (img.startsWith("/uploads")) {
        return `/api/uploads${img}`;
    }
    return img;
};

export default function BentoPresetA({
    hero,
    rightTop,
    rightBottom,
    className,
    headingTitle = "ไฮไลท์ข่าวและกิจกรรม",
    headingSubtitle,
    headingIcon,
}: Props) {
    return (
        <section className={cn("mx-auto max-w-screen-xl px-4 md:px-6", className)}>
            {/* ---- Heading ---- */}
            <div className="mb-4 md:mb-6 flex items-end justify-between gap-3">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-bold inline-flex items-center gap-2">
                        {headingIcon}
                        <span>{headingTitle}</span>
                    </h2>
                    {headingSubtitle ? (
                        <p className="text-sm text-muted-foreground">{headingSubtitle}</p>
                    ) : (
                        <div className="h-px w-24 bg-foreground/20" />
                    )}
                </div>
            </div>

            {/* ---- Grid ---- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                <ArticleHero item={hero} />
                <div className="grid grid-rows-2 gap-5 md:gap-6">
                    <ArticleThumb item={rightTop} />
                    <ArticleThumb item={rightBottom} />
                </div>
            </div>
        </section>
    );
}

function ArticleHero({ item }: { item: Item }) {
    return (
        <Link
            href={item.href}
            className="group relative md:col-span-2 overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5"
        >
            <div className="relative h-[360px] md:h-[525px]">
                <Image
                    src={resolveImagePath(item.image) || fallbackImg}
                    alt={item.title}
                    fill
                    priority
                    sizes="(min-width:1280px) 66vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute -inset-px rounded-[inherit] bg-[radial-gradient(1200px_400px_at_0%_-5%,rgba(99,102,241,0.35),transparent_50%)]" />
                <div className="absolute inset-x-5 bottom-5 md:inset-x-7 md:bottom-7">
                    {item.kicker && (
                        <Badge
                            variant={item.kicker === "ข่าวประชาสัมพันธ์" ? "default" : "secondary"}
                            className="backdrop-blur-sm rounded-full"
                        >
                            {item.kicker === "ข่าวประชาสัมพันธ์" ? "ข่าวประชาสัมพันธ์" : "กิจกรรม"}
                        </Badge>
                    )}
                    <h3 className="mt-2 text-white font-extrabold leading-tight text-xl md:text-2xl max-w-[46ch] drop-shadow">
                        {item.title}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-2 text-white font-semibold">
                        <span className="text-sm md:text-base">อ่านเพิ่มเติม</span>
                        <ArrowRight className="size-4 md:size-5 translate-x-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

function ArticleThumb({ item }: { item: Item }) {
    return (
        <Link
            href={item.href}
            className="group relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5"
        >
            <div className="relative h-[200px] md:h-[250px]">
                <Image
                    src={resolveImagePath(item.image) || fallbackImg}
                    alt={item.title}
                    fill
                    sizes="(min-width:1280px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                    {item.kicker && (
                        <Badge
                            variant={item.kicker === "ข่าวประชาสัมพันธ์" ? "default" : "secondary"}
                            className="backdrop-blur-sm rounded-full"
                        >
                            {item.kicker === "ข่าวประชาสัมพันธ์" ? "ข่าวประชาสัมพันธ์" : "กิจกรรม"}
                        </Badge>
                    )}
                    <h3 className="mt-1 text-white text-lg font-semibold leading-snug line-clamp-2 drop-shadow">
                        {item.title}
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-2 text-white/90">
                        <span className="text-sm">อ่านเพิ่มเติม</span>
                        <ArrowRight className="size-4 translate-x-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
