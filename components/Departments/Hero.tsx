import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero(props: {
    title: string; subtitle?: string | null;
    image?: string | null; badge?: string | null;
    hasDownloads?: boolean;
}) {
    const { title, subtitle, image, badge, hasDownloads } = props;

    return (
        <section className="relative overflow-hidden rounded-2xl border">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-100/80 via-sky-100/60 to-indigo-100/70" />
            {image ? (
                <div className="absolute inset-0 -z-10 opacity-25">
                    <Image src={image} alt={title} fill className="object-cover" priority />
                </div>
            ) : null}

            <div className="p-6 md:p-10">
                {badge && <Badge variant="secondary" className="mb-3">{badge}</Badge>}
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
                {subtitle ? (
                    <p className="mt-2 text-muted-foreground md:text-lg leading-relaxed">{subtitle}</p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-2">
                    <a href="#missions"><Button size="sm">ภารกิจ</Button></a>
                    <a href="#services"><Button size="sm" variant="secondary">บริการ</Button></a>
                    {hasDownloads && <a href="#downloads"><Button size="sm" variant="outline">แบบฟอร์ม/คู่มือ</Button></a>}
                    <a href="#contact"><Button size="sm" variant="ghost">ติดต่อ</Button></a>
                </div>
            </div>
        </section>
    );
}
