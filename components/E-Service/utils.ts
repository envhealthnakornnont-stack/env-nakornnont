import type { EServiceItem } from "./types";

export function normalizeEService(arr: EServiceItem[]): EServiceItem[] {
  return arr.map(x => ({
    id: String(x.id),
    title: String(x.title),
    linkURL: String(x.linkURL),
    image: x.image ? String(x.image) : null,
    createdAt: x.createdAt ? String(x.createdAt) : undefined,
    updatedAt: x.updatedAt ? String(x.updatedAt) : undefined,
  }));
}

export function filterByQuery(items: EServiceItem[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return items;
  return items.filter(i => i.title.toLowerCase().includes(s));
}
