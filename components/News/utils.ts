import type { Newsish, NewsType } from "./types";

export const fallbackImg = "/default-news.jpg";

export function resolveImagePath(img?: string | null) {
  if (!img) return fallbackImg;
  if (img.startsWith("/uploads")) return `/api/uploads${img}`;
  return img;
}

export function toPlainText(input: unknown): string {
  if (typeof input === "string") {
    return input.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
  }
  try {
    const obj: any = input;
    if (obj?.ops && Array.isArray(obj.ops)) {
      return obj.ops
        .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
        .join("")
        .trim();
    }
  } catch {}
  return "";
}

export function truncate(str: string, max = 120) {
  if (!str) return "";
  return str.length <= max ? str : str.slice(0, max).trimEnd() + "…";
}

export function authorName(it: Newsish) {
  const fn = (it.author?.firstname ?? "").trim();
  const ln = (it.author?.lastname ?? "").trim();
  return fn || ln ? `${fn}${fn && ln ? " " : ""}${ln}` : "";
}

export function hrefFor(type: NewsType, slug: string) {
  return type === "news" ? `/news/news-updates/${slug}` : `/news/activities/${slug}`;
}

// eg: [1, '…', 4, 5, 6, '…', 12]
export function buildPageList(current: number, total: number, delta = 1): Array<number | "..."> {
  if (total <= 1) return [1];
  const range: number[] = [1];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  for (let i = left; i <= right; i++) range.push(i);
  range.push(total);
  const pages: Array<number | "..."> = [];
  let prev = 0;
  for (const n of range) {
    if (prev) {
      if (n - prev === 2) pages.push(prev + 1);
      else if (n - prev > 2) pages.push("...");
    }
    pages.push(n);
    prev = n;
  }
  if (pages[1] === "...") pages.splice(1, 1);
  if (pages[pages.length - 2] === "...") pages.splice(pages.length - 2, 1);
  return pages;
}
