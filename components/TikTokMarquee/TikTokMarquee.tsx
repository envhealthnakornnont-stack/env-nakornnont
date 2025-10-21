import { fetchTikTokOEmbeds } from "@/lib/tiktok";
import TikTokMarqueeClient from "./TikTokMarqueeClient";

type Props = {
    urls: string[]; // มีแค่ TikTok URLs
    title?: string; // ใช้เป็น sr-only เพื่อ A11y
};

export default async function TikTokMarquee({ urls, title = "วิดีโอกิจกรรมจาก TikTok" }: Props) {
    const items = await fetchTikTokOEmbeds(urls);

    // fallback: ถ้าไม่มีสักรายการ ก็ไม่ต้องแสดง
    if (!items.length) return null;

    return (
        <section aria-labelledby="tt-marquee" className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h2 id="tt-marquee" className="sr-only">{title}</h2>

            {/* สำเนา static เพื่อ screen reader */}
            <ul className="sr-only">
                {items.map((it, i) => (
                    <li key={i}>
                        <a href={it.url}>{it.data.title || it.url}</a>
                    </li>
                ))}
            </ul>

            <TikTokMarqueeClient
                title="TikTok Highlights"
                subtitle="คลิปสั้นให้ความรู้ ประชาสัมพันธ์ และกิจกรรม"
                size="lg"
                items={items.map((it) => ({
                    url: it.url,
                    title: it.data.title ?? "ดูวิดีโอ",
                    thumbnail: it.data.thumbnail_url, // <- ได้จาก oEmbed
                }))}
            />
        </section>
    );
}