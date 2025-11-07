import { ApiTag } from "@/components/News/Content/api-types";

export const mapTagsToSlugs = (tags?: ApiTag[] | null): string[] =>
    (tags ?? [])
        .map((t) => t.slug ?? t.name ?? "")
        .filter((s): s is string => Boolean(s));

export const resolveUpload = (src?: string | null) =>
    !src ? null : src.startsWith("/uploads") ? `/api/uploads${src}` : src;
