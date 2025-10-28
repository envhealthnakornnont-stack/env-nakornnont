"use client";

import * as React from "react";
import ImageLightbox from "./ImageLightbox";

/**
 * รับ HTML string แล้ว render ภายใน .prose
 * ดัก click ที่ <img> ทุกตัว เพื่อเปิด Lightbox แสดงรูปขนาดใหญ่
 * NOTE: รูปภายใน contentHtml ให้ตั้งค่า src ถูกต้อง (relative หรือ absolute)
 */
export default function ContentWithLightbox({ html }: { html: string }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [src, setSrc] = React.useState<string | null>(null);
    const [alt, setAlt] = React.useState<string>("");
    const [caption, setCaption] = React.useState<string | null>(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handler = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (t && t.tagName.toLowerCase() === "img") {
                const img = t as HTMLImageElement;

                setSrc(img.src || null);
                setAlt(img.alt || "");

                // หา figcaption ใกล้ๆ (ถ้าอยู่ใน <figure>)
                const figure = img.closest("figure");
                const cap = figure?.querySelector("figcaption");
                setCaption(cap?.textContent?.trim() || null);

                setOpen(true);
            }
        };

        el.addEventListener("click", handler);
        return () => el.removeEventListener("click", handler);
    }, []);

    return (
        <>
            <div
                ref={ref}
                className="
          prose prose-neutral dark:prose-invert max-w-none
          prose-headings:scroll-mt-24
          prose-img:rounded-lg prose-img:shadow
          prose-figcaption:text-muted-foreground prose-figcaption:text-xs
          prose-a:underline-offset-4 hover:prose-a:opacity-80
          prose-hr:my-8
          prose-li:my-1
        "
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: html }}
            />

            <ImageLightbox open={open} onOpenChange={setOpen} src={src} alt={alt} caption={caption} />
        </>
    );
}