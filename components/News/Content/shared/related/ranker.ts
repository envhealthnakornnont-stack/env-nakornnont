import type { RelatedItem } from "./types";

export function scoreRelated(
    pool: RelatedItem[],
    currentId: string | number,
    currentTags: string[]
): RelatedItem[] {
    const tags = new Set((currentTags ?? []).map((t) => t.toLowerCase()));
    const rows = pool
        .filter((it) => it.id !== currentId)
        .map((it) => {
            const its = new Set((it.tags ?? []).map((t) => t.toLowerCase()));
            let overlap = 0;
            for (const t of its) if (tags.has(t)) overlap++;
            return { it, overlap };
        })
        .filter((r) => r.overlap > 0);

    rows.sort((a, b) => {
        if (b.overlap !== a.overlap) return b.overlap - a.overlap;
        const ta = a.it.createdAt ? new Date(a.it.createdAt).getTime() : 0;
        const tb = b.it.createdAt ? new Date(b.it.createdAt).getTime() : 0;
        return tb - ta;
    });

    return rows.map((r) => r.it);
}