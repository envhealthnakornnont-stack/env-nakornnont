import type { RelatedItem, ApiListResponse } from "./types";
import { adaptNewsToRelated, adaptActivityToRelated } from "../../adapters/apiToRelatedAdapter";
import { scoreRelated } from "./ranker";

const base =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/** รวมผลจากหลายแท็ก → dedupe ตาม id */
function mergeDedupe(items: RelatedItem[]): RelatedItem[] {
    const map = new Map<string | number, RelatedItem>();
    for (const it of items) if (!map.has(it.id)) map.set(it.id, it);
    return Array.from(map.values());
}

/** News: ดึงตามหลายแท็ก + จัดอันดับ */
export async function fetchRelatedNews(
    currentId: string | number,
    currentTags: string[],
    limit = 3
): Promise<RelatedItem[]> {
    // ถ้าไม่มีแท็ก → fallback
    if (!currentTags?.length) return fetchRelatedNewsFallback(currentId, [], limit);

    const tagSlugs = currentTags.slice(0, 3); // เลือก 3 แท็กแรกพอ
    const chunks = await Promise.all(
        tagSlugs.map(async (slug) => {
            const res = await fetch(
                `${base}/api/news?tag=${encodeURIComponent(slug)}&pageSize=6&sort=latest`,
                { next: { revalidate: 60 } }
            );
            if (!res.ok) return [] as RelatedItem[];
            const data = (await res.json()) as ApiListResponse<any>;
            return (data.items ?? []).map(adaptNewsToRelated);
        })
    );

    const merged = mergeDedupe(chunks.flat());
    const ranked = scoreRelated(merged, currentId, currentTags);
    if (ranked.length >= limit) return ranked.slice(0, limit);

    // ไม่พอ → fallback
    const tail = await fetchRelatedNewsFallback(currentId, currentTags, limit * 4);
    const more = mergeDedupe([...ranked, ...tail]).filter((x) => x.id !== currentId);
    return more.slice(0, limit);
}

/** News: fallback ดึงชุดใหญ่แล้วคัดเอง */
export async function fetchRelatedNewsFallback(
    currentId: string | number,
    currentTags: string[],
    limit = 3,
    poolSize = 50
): Promise<RelatedItem[]> {
    const res = await fetch(`${base}/api/news?pageSize=${poolSize}&sort=latest`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ApiListResponse<any>;
    const pool = (data.items ?? []).map(adaptNewsToRelated);
    const ranked = scoreRelated(pool, currentId, currentTags);
    // ถ้ายังว่าง → ส่ง “ล่าสุด” แทน (แต่ตัด current ออก)
    if (!ranked.length) {
        const latest = pool
            .filter((x) => x.id !== currentId)
            .sort(
                (a, b) =>
                    (b.createdAt ? +new Date(b.createdAt) : 0) -
                    (a.createdAt ? +new Date(a.createdAt) : 0)
            );
        return latest.slice(0, limit);
    }
    return ranked.slice(0, limit);
}

/** Activities: เหมือนกันเป๊ะ แค่เปลี่ยน endpoint + adapter */
export async function fetchRelatedActivities(
    currentId: string | number,
    currentTags: string[],
    limit = 3
): Promise<RelatedItem[]> {
    if (!currentTags?.length) return fetchRelatedActivitiesFallback(currentId, [], limit);

    const tagSlugs = currentTags.slice(0, 3);
    const chunks = await Promise.all(
        tagSlugs.map(async (slug) => {
            const res = await fetch(
                `${base}/api/activities?tag=${encodeURIComponent(slug)}&pageSize=6&sort=latest`,
                { next: { revalidate: 60 } }
            );
            if (!res.ok) return [] as RelatedItem[];
            const data = (await res.json()) as ApiListResponse<any>;
            return (data.items ?? []).map(adaptActivityToRelated);
        })
    );

    const merged = mergeDedupe(chunks.flat());
    const ranked = scoreRelated(merged, currentId, currentTags);
    if (ranked.length >= limit) return ranked.slice(0, limit);

    const tail = await fetchRelatedActivitiesFallback(currentId, currentTags, limit * 4);
    const more = mergeDedupe([...ranked, ...tail]).filter((x) => x.id !== currentId);
    return more.slice(0, limit);
}

export async function fetchRelatedActivitiesFallback(
    currentId: string | number,
    currentTags: string[],
    limit = 3,
    poolSize = 50
): Promise<RelatedItem[]> {
    const res = await fetch(`${base}/api/activities?pageSize=${poolSize}&sort=latest`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ApiListResponse<any>;
    const pool = (data.items ?? []).map(adaptActivityToRelated);
    const ranked = scoreRelated(pool, currentId, currentTags);
    if (!ranked.length) {
        const latest = pool
            .filter((x) => x.id !== currentId)
            .sort(
                (a, b) =>
                    (b.createdAt ? +new Date(b.createdAt) : 0) -
                    (a.createdAt ? +new Date(a.createdAt) : 0)
            );
        return latest.slice(0, limit);
    }
    return ranked.slice(0, limit);
}