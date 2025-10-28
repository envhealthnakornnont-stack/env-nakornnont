import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { Activity } from "@/components/News/Content/ActivityArticle/types";
import ActivityArticleModern from "@/components/News/Content/ActivityArticle/ActivityArticle";
import { fetchRelatedActivities } from "@/components/News/Content/shared/related/api";
import { adaptApiActivityToArticle } from "@/components/News/Content/ActivityArticle/apiToArticleAdapter";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchActivityDetail(id: string): Promise<Activity | null> {
  const res = await fetch(`${baseURL}/api/activities/${id}`, { next: { revalidate: 30 } });
  if (res.status === 403) redirect("/"); // กันกรณีดูไม่ได้
  if (!res.ok) return null;
  const payload = await res.json();
  const apiItem = payload.item ?? payload;
  if (!apiItem) return null;
  return adaptApiActivityToArticle(apiItem);
}

const stripHtml = (html: string) =>
  (html || "").replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

const pickOgImage = (item: Activity) =>
  item.gallery?.[0]?.src || "/logo-nonthaburi.jpg";

// -------- metadata --------
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchActivityDetail(id);
  const canonical = `/activities/${id}`;

  if (!item) {
    return {
      title: "ไม่พบข้อมูลกิจกรรม",
      description: "กิจกรรมที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่จริง",
      alternates: { canonical },
    };
  }

  const desc =
    stripHtml(item.contentHtml).slice(0, 160) ||
    "กิจกรรมของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี";
  const imageUrl = pickOgImage(item);

  return {
    title: `${item.title} | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: `${item.title} | กิจกรรม`,
      description: desc,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      url: canonical,
      siteName: "สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
      type: "article",
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: desc,
      images: [imageUrl],
    },
  };
}

// -------- page --------
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await fetchActivityDetail(id);
  if (!item) return notFound();

  // ดึง Related จริงจาก API ด้วย tag เดียวกัน (มี fallback ในตัวฟังก์ชัน)
  const related = await fetchRelatedActivities(item.id, item.tags ?? [], 3);
  return (
    <div className="py-6 lg:py-8">
      <ActivityArticleModern item={item} related={related} />
    </div>
  );
}
