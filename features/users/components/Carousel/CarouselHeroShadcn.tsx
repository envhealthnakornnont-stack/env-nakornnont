"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";

export type CarouselImage = {
    id: string;
    title: string;
    href: string;
    imageMobile: string;
    imageDesktop: string;
    badge?: string | null;
    alt?: string;
};

type Props = {
    slides: CarouselImage[];
    delayMs?: number; // default 5000
};

const resolvePath = (img: string | null | undefined) => {
    if (!img) return "/bg-hero.jpg";
    if (img.startsWith("/uploads")) return `/api/uploads${img}`;
    return img;
};

export default function CarouselHeroShadcn({ slides, delayMs = 5000 }: Props) {
    const [api, setApi] = React.useState<CarouselApi | null>(null);
    const [current, setCurrent] = React.useState(0);
    const [autoPlay, setAutoPlay] = React.useState(true);
    const [isHovering, setIsHovering] = React.useState(false);

    // เคารพ prefers-reduced-motion
    React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) setAutoPlay(false);
    }, []);

    // ปลั๊กอิน Autoplay — ให้เราเป็นคนคุม interaction เอง
    const autoplayRef = React.useRef<ReturnType<typeof Autoplay> | null>(null);
    if (!autoplayRef.current) {
        autoplayRef.current = Autoplay({
            delay: delayMs,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
        });
    }

    const total = slides.length;
    const multi = total > 1;
    const shouldAutoplay = autoPlay && multi;

    // sync index
    React.useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        onSelect();
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    // เริ่มเล่นครั้งแรกหลัง mount
    React.useEffect(() => {
        if (!api || !shouldAutoplay) return;
        const id = window.setTimeout(() => autoplayRef.current?.play?.(), 0);
        return () => window.clearTimeout(id);
    }, [api, shouldAutoplay]);

    // คุมการหยุด/เล่นต่อระหว่าง interaction
    React.useEffect(() => {
        if (!api || !shouldAutoplay) return;

        const stop = () => autoplayRef.current?.stop?.();
        const resume = () => {
            if (!isHovering) autoplayRef.current?.play?.();
        };

        api.on("pointerDown", stop);
        api.on("pointerUp", resume);
        api.on("settle", resume);
        api.on("select", resume);

        return () => {
            api.off("pointerDown", stop);
            api.off("pointerUp", resume);
            api.off("settle", resume);
            api.off("select", resume);
        };
    }, [api, shouldAutoplay, isHovering]);

    if (!slides?.length) return null;

    const ensureAuto = () => {
        if (shouldAutoplay && !isHovering) {
            requestAnimationFrame(() => autoplayRef.current?.play?.());
        }
    };

    const goTo = (idx: number) => {
        if (!api) return;
        api.scrollTo(idx);
        ensureAuto();
    };

    const goPrev = () => {
        if (!api) return;
        api.scrollPrev();
        ensureAuto();
    };

    const goNext = () => {
        if (!api) return;
        api.scrollNext();
        ensureAuto();
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
        autoplayRef.current?.stop?.();
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (shouldAutoplay) autoplayRef.current?.play?.();
    };

    return (
        <section aria-label="ไฮไลท์ข่าว/ประกาศสำคัญ" role="region" aria-roledescription="carousel" className="relative my-8 lg:my-12">
            <div aria-live="polite" className="sr-only">
                {`สไลด์ที่ ${current + 1}/${slides.length}: ${slides[current]?.title ?? ""}`}
            </div>
            <div className="max-w-screen-xl mx-auto px-4">
                <Carousel
                    opts={{ loop: multi, align: "start", duration: 18 }}
                    plugins={shouldAutoplay && autoplayRef.current ? [autoplayRef.current] : []}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {slides.map((s, i) => (
                            <CarouselItem key={s.id} className="relative">
                                <article className="relative w-full">
                                    {/* คุมความสูงแบบ clamp + ไม่มี CLS */}
                                    <div
                                        className="
                                        relative w-full
                                        h-[clamp(220px,60vh,480px)]
                                        md:h-[clamp(260px,65vh,540px)]
                                        lg:h-[clamp(300px,70vh,580px)]
                                        xl:h-[clamp(320px,75vh,600px)]
                                        2xl:h-[clamp(400px,75vh,680px)]
                                        overflow-hidden rounded-2xl bg-muted
                                        "
                                    >
                                        <Link href={s.href} prefetch aria-label={s.title} className="block h-full w-full">
                                            {/* Mobile */}
                                            <div className="relative h-full w-full md:hidden">
                                                <Image
                                                    src={resolvePath(s.imageMobile)}
                                                    alt={s.alt ?? s.title}
                                                    fill
                                                    sizes="100vw"
                                                    priority={i === 0}
                                                    loading={i === 0 ? undefined : "lazy"}
                                                    className="object-cover"
                                                />
                                            </div>
                                            {/* Desktop */}
                                            <div className="relative h-full w-full hidden md:block">
                                                <Image
                                                    src={resolvePath(s.imageDesktop)}
                                                    alt={s.alt ?? s.title}
                                                    fill
                                                    sizes="(max-width: 1024px) 100vw, 1200px"
                                                    priority={i === 0}
                                                    loading={i === 0 ? undefined : "lazy"}
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Gradient + Title + Badge */}
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-black/0" />
                                            <div className="pointer-events-none absolute left-4 right-4 bottom-4 text-white">
                                                {s.badge && (
                                                    <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black mb-2">
                                                        {s.badge}
                                                    </span>
                                                )}
                                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold drop-shadow">{s.title}</h2>
                                            </div>
                                        </Link>
                                    </div>
                                </article>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Prev/Next เฉพาะหลายสไลด์ */}
                    {multi && (
                        <>
                            <CarouselPrevious aria-label="สไลด์ก่อนหน้า" onClick={goPrev} className="left-2" />
                            <CarouselNext aria-label="สไลด์ถัดไป" onClick={goNext} className="right-2" />
                        </>
                    )}

                    {/* ปุ่ม Play/Pause + จุดสถานะ */}
                    {multi && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/35 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Button
                                size="icon"
                                variant="ghost"
                                aria-label={shouldAutoplay ? "หยุดเลื่อนอัตโนมัติ" : "เริ่มเลื่อนอัตโนมัติ"}
                                onClick={() => {
                                    if (shouldAutoplay) {
                                        autoplayRef.current?.stop?.();
                                        setAutoPlay(false);
                                    } else {
                                        setAutoPlay(true);
                                        if (!isHovering) requestAnimationFrame(() => autoplayRef.current?.play?.());
                                    }
                                }}
                                className="text-white hover:text-white"
                            >
                                {shouldAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>

                            <div className="flex items-center gap-1">
                                {slides.map((_, idx) => {
                                    const active = idx === current;
                                    return (
                                        <button
                                            key={idx}
                                            aria-label={`ไปยังสไลด์ที่ ${idx + 1}`}
                                            aria-current={active ? "true" : undefined}
                                            onClick={() => goTo(idx)}
                                            className={[
                                                "h-2.5 w-2.5 rounded-full transition-all",
                                                active ? "bg-white scale-100" : "bg-white/70 hover:bg-white/90 scale-90",
                                            ].join(" ")}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Carousel>
            </div>
        </section>
    );
}
