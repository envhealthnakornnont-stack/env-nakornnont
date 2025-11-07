import { notFound } from "next/navigation";
import { Metadata } from "next";
import NewsArticleModern from "@/components/News/Content/NewsArticle/NewsArticle";
import type { NewsArticle } from "@/components/News/Content/NewsArticle/types";
import { adaptApiNewsToArticle  } from "@/components/News/Content/NewsArticle/apiToArticleAdapter";
import { resolveImage } from "@/components/News/Content/NewsArticle/utils";
import { fetchRelatedNews } from "@/components/News/Content/shared/related/api";
import { resolveImagePath } from "@/components/News/utils";

// --- baseURL helper ---
const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchNews(id: string): Promise<NewsArticle | null> {
  const res = await fetch(`${baseURL}/api/news/${id}`, { 
    // next: { revalidate: 30 } 
    cache: "no-store",
  });
  if (!res.ok) return null;
  const payload = await res.json();
  const apiItem = payload.item ?? payload;
  if (!apiItem) return null;
  return adaptApiNewsToArticle(apiItem);
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const article = await fetchNews(id);
  const canonical = `/news/news-updates/${id}`;

  if (!article) {
    return {
      title: "ไม่พบข้อมูลข่าว",
      description: "ข่าวที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่จริง",
      alternates: { canonical },
    };
  }

  // ใช้ภาพจาก hero / image ของข่าว
  const imageUrl =
    resolveImage(article.hero?.src) || resolveImagePath(null) || "/logo-nonthaburi.jpg";
  const desc =
    article.contentHtml
      ?.replace(/<[^>]*>?/gm, " ")
      ?.replace(/\s+/g, " ")
      ?.trim()
      ?.slice(0, 160) ||
    "ข่าวประชาสัมพันธ์ สำนักสาธารณสุขและสิ่งแวดล้อม";

  return {
    title: `${article.title} | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: `${article.title} | ข่าวประชาสัมพันธ์`,
      description: desc,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      url: canonical,
      siteName: "สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
      type: "article",
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: desc,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await fetchNews(id);
  if (!article) return notFound();

  const related = await fetchRelatedNews(article.id, article.tags ?? [], 3);

  return (
    <div className="py-6 lg:py-8">
      <NewsArticleModern item={article} related={related}/>
    </div>
  );
}
