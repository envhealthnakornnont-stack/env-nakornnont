import { resolveImagePath } from "@/components/News/utils";
import { ApiNewsItem } from "@/components/News/Content/api-types";
import { mapTagsToSlugs } from "@/components/News/Content/utils";
import type { NewsArticle } from "@/components/News/Content/NewsArticle/types";

// แปลงทรง API (ที่ได้จาก /api/news/[id]) → ทรงที่ NewsArticleModern ใช้
export function adaptApiNewsToArticle(apiItem: ApiNewsItem): NewsArticle {
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
    tags: mapTagsToSlugs(apiItem.tags),
    author: {
      name: fullAuthorName || "ไม่ทราบชื่อผู้เขียน",
      department: apiItem.author?.department ?? null,
      email: apiItem.author?.email ?? null,
      avatar: resolveImagePath(apiItem.author?.avatar ?? null) ?? null,
    },
    attachments: Array.isArray(apiItem.attachments) ? apiItem.attachments : undefined,
  };
}
