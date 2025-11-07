import type { Activity } from "./types";
import type { ApiActivityItem } from "@/components/News/Content/api-types";
import { mapTagsToSlugs, resolveUpload } from "@/components/News/Content/utils";

// const resolveUpload = (src?: string | null) =>
//     !src ? null : src.startsWith("/uploads") ? `/api/uploads${src}` : src;

export function adaptApiActivityToArticle(apiItem: ApiActivityItem): Activity {
  const name = [apiItem.author?.firstname, apiItem.author?.lastname]
    .filter(Boolean)
    .join(" ");

  // map gallery อย่างปลอดภัย: ข้ามรายการที่ไม่มี src หลัง resolve
  const gallery =
    (apiItem.gallery ?? [])
      .map((g) => {
        const src = resolveUpload(g?.src ?? null);
        if (!src) return null;
        return { src, alt: g?.alt ?? undefined };
      })
      .filter(
        (v): v is { src: string; alt: string | undefined } => v !== null
      );

  return {
    id: apiItem.id,
    title: apiItem.title,
    createdAt: apiItem.createdAt ?? new Date().toISOString(),
    location: apiItem.location ?? null,
    organizer: apiItem.organizer ?? null,
    gallery,
    contentHtml: apiItem.contentHtml ?? "",
    tags: mapTagsToSlugs(apiItem.tags),
    attachments: Array.isArray(apiItem.attachments) ? apiItem.attachments : undefined,
    author: {
      name: name || "ไม่ทราบชื่อผู้เขียน",
      email: apiItem.author?.email ?? null,
      department: apiItem.author?.department ?? null,
      avatar: resolveUpload(apiItem.author?.avatar ?? null) ?? null,
    },
  };
}
