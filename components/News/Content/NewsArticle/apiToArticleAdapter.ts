import type { NewsArticle } from "./types";

// ช่วยแปลง path อัปโหลดเป็น /api/uploads หรือปล่อย URL ตรง
export const resolveImagePath = (src?: string | null) => {
    if (!src) return null;
    return src.startsWith("/uploads") ? `/api/uploads${src}` : src;
};

// แปลงทรง API (ที่ได้จาก /api/news/[id]) → ทรงที่ NewsArticleModern ใช้
export function adaptApiNewsToArticle(apiItem: any): NewsArticle {
    const fullAuthorName = [apiItem.author?.firstname, apiItem.author?.lastname]
        .filter(Boolean)
        .join(" ");

    return {
        id: apiItem.id,
        title: apiItem.title,
        hero: {
            src: resolveImagePath(apiItem.image) || "/logo-nonthaburi.jpg",
            alt: apiItem.title,
            credit: apiItem.heroCredit ?? undefined,
        },
        contentHtml: apiItem.contentHtml ?? "",
        createdAt: apiItem.createdAt ?? new Date().toISOString(),
        tags: (apiItem.tags ?? []).map((t: any) => t.slug ?? t.name).filter(Boolean),
        author: {
            name: fullAuthorName || "ไม่ทราบชื่อผู้เขียน",
            department: apiItem.author?.department ?? null,
            email: apiItem.author?.email ?? null,
            avatar: resolveImagePath(apiItem.author?.avatar) ?? null,
        },
        attachments: Array.isArray(apiItem.attachments)
            ? apiItem.attachments
            : undefined, // ถ้าใน DB เป็น JSON: [{label,url}, ...]
    };
}
