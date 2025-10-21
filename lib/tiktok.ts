// lib/tiktok.ts
export type TikTokOEmbed = {
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url: string;
  html?: string;
  provider_name?: string;
  provider_url?: string;
};

const TIKTOK_OEMBED = "https://www.tiktok.com/oembed?url=";

// ดึง oEmbed สำหรับ URL เดียว
export async function fetchTikTokOEmbed(url: string): Promise<TikTokOEmbed | null> {
  try {
    const u = url.trim();
    const res = await fetch(`${TIKTOK_OEMBED}${encodeURIComponent(u)}`, {
      // แคช 1 วัน ปรับได้
      next: { revalidate: 60 * 60 * 24 },
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; NakornnontBot/1.0; +https://example.com)",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as TikTokOEmbed;
    if (!data?.thumbnail_url) return null;
    return data;
  } catch {
    return null;
  }
}

// ดึงหลาย URL พร้อมกัน (ข้ามตัวที่ error)
export async function fetchTikTokOEmbeds(urls: string[]) {
  const results = await Promise.all(urls.map(fetchTikTokOEmbed));
  return results
    .map((d, i) => ({ data: d, url: urls[i] }))
    .filter((x) => !!x.data) as { data: TikTokOEmbed; url: string }[];
}
