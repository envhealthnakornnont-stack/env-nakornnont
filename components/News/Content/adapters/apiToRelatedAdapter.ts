import type { RelatedItem } from "../shared/related/types";

/** news item จาก API → RelatedItem */
export function adaptNewsToRelated(apiItem: any): RelatedItem {
  const img =
    apiItem.image?.startsWith?.("/uploads")
      ? `/api/uploads${apiItem.image}`
      : apiItem.image || null;

  return {
    id: apiItem.id,
    title: apiItem.title,
    href: `/news/news-updates/${apiItem.id}`,
    image: img,
    tags: (apiItem.tags ?? []).map((t: any) => t.slug ?? t.name).filter(Boolean),
    createdAt: apiItem.createdAt,
    subtitle: apiItem.author?.department ?? undefined,
  };
}

/** activity item จาก API → RelatedItem */
export function adaptActivityToRelated(apiItem: any): RelatedItem {
  const cover =
    apiItem.cover?.startsWith?.("/uploads")
      ? `/api/uploads${apiItem.cover}`
      : apiItem.cover || apiItem.gallery?.[0]?.src || null;

  const resolved =
    cover?.startsWith?.("/uploads") ? `/api/uploads${cover}` : cover;

  return {
    id: apiItem.id,
    title: apiItem.title,
    href: `/activities/${apiItem.id}`,
    image: resolved,
    tags: (apiItem.tags ?? []).map((t: any) => t.slug ?? t.name).filter(Boolean),
    createdAt: apiItem.createdAt,
    subtitle: apiItem.organizer ?? apiItem.department ?? undefined,
  };
}