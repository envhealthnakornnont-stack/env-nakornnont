import { ApiActivityItem, ApiNewsItem } from "@/components/News/Content/api-types";
import type { RelatedItem } from "@/components/News/Content/shared/related/types";
import { mapTagsToSlugs, resolveUpload } from "@/components/News/Content/utils";

/** news item จาก API → RelatedItem */
export function adaptNewsToRelated(apiItem: ApiNewsItem): RelatedItem {
  const img = resolveUpload(apiItem.image) ?? apiItem.image ?? null;

  return {
    id: apiItem.id,
    title: apiItem.title,
    href: `/news/news-updates/${apiItem.id}`,
    image: img,
    tags: mapTagsToSlugs(apiItem.tags),
    createdAt: apiItem.createdAt ?? undefined,
    subtitle: apiItem.author?.department ?? undefined,
  };
}

/** activity item จาก API → RelatedItem */
export function adaptActivityToRelated(apiItem: ApiActivityItem): RelatedItem {
  const cover = resolveUpload(apiItem.cover) ?? apiItem.cover ?? apiItem.gallery?.[0]?.src ?? null;
  const resolved = resolveUpload(cover) ?? cover;

  return {
    id: apiItem.id,
    title: apiItem.title,
    href: `/activities/${apiItem.id}`,
    image: resolved ?? null,
    tags: mapTagsToSlugs(apiItem.tags),
    createdAt: apiItem.createdAt ?? undefined,
    subtitle: apiItem.organizer ?? apiItem.department ?? undefined,
  };
}