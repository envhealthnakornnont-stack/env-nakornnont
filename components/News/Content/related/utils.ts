export type RelatedItem = {
  id: string | number;
  title: string;
  href: string;              // ลิงก์ไปอ่านต่อ
  image?: string | null;     // รูปปก 16:9
  tags?: string[];           // ใช้แมตช์
  createdAt?: string;        // ISO ใช้ tie-break
  subtitle?: string;         // บรรทัดรอง (เช่น ประเภท/หน่วยงาน/วันที่)
};

type ScoreRow = { item: RelatedItem; score: number };

/** คืนลิสต์เรียงจากการ “ซ้ำแท็กมากสุด → วันใหม่กว่า” */
export function getRelatedByTags(
  all: RelatedItem[],
  currentId: string | number,
  currentTags: string[] = [],
  limit = 3
): RelatedItem[] {
  const tags = new Set(currentTags.map((t) => t.toLowerCase()));
  if (!tags.size) return [];

  const scored: ScoreRow[] = [];

  for (const it of all) {
    if (it.id === currentId) continue;
    const its = new Set((it.tags || []).map((t) => t.toLowerCase()));
    let overlap = 0;
    for (const t of its) if (tags.has(t)) overlap++;

    if (overlap > 0) {
      scored.push({ item: it, score: overlap });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // tie-break: createdAt ใหม่กว่าอยู่ก่อน
    const ta = a.item.createdAt ? new Date(a.item.createdAt).getTime() : 0;
    const tb = b.item.createdAt ? new Date(b.item.createdAt).getTime() : 0;
    return tb - ta;
  });

  return scored.slice(0, limit).map((r) => r.item);
}
