import type { Activity } from "./types";

const resolveUpload = (src?: string | null) =>
    !src ? null : src.startsWith("/uploads") ? `/api/uploads${src}` : src;

export function adaptApiActivityToArticle(apiItem: any): Activity {
    const name = [apiItem.author?.firstname, apiItem.author?.lastname]
        .filter(Boolean)
        .join(" ");

    // รองรับทั้งกรณีที่ gallery เก็บเป็น JSON array ของ {src,alt}
    // และกรณีที่ฝั่ง API อาจไม่มี -> ให้กลายเป็น [] ไป
    const gallery: { src: string; alt?: string }[] = Array.isArray(apiItem.gallery)
        ? apiItem.gallery.map((g: any) => ({
            src: resolveUpload(g?.src) || "",
            alt: g?.alt || "",
        }))
        : [];

    return {
        id: apiItem.id,
        title: apiItem.title,
        createdAt: apiItem.createdAt ?? new Date().toISOString(),
        location: apiItem.location ?? null,
        organizer: apiItem.organizer ?? null,
        gallery,
        contentHtml: apiItem.contentHtml ?? "",
        tags: (apiItem.tags ?? []).map((t: any) => t.slug ?? t.name).filter(Boolean),
        attachments: Array.isArray(apiItem.attachments) ? apiItem.attachments : undefined,
        author: {
            name: name || "ไม่ทราบชื่อผู้เขียน",
            email: apiItem.author?.email ?? null,
            department: apiItem.author?.department ?? null,
            avatar: resolveUpload(apiItem.author?.avatar) ?? null,
        },
    };
}
