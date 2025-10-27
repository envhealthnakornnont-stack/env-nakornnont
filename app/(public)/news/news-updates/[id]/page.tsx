import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { resolveImage, stripHtml } from "@/components/News/Content/NewsArticle/utils";
import { NewsArticle } from "@/components/News/Content/NewsArticle/types";
import NewsArticleView from "@/components/News/Content/NewsArticle/NewsArticle";

async function fetchNews(id: string): Promise<NewsArticle | null> {
  const base =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/news/${id}`, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  const data = await res.json();

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    image: data.image,
    description: stripHtml(data.description || data.content)?.slice(0, 160),
    content: data.content || "",
    tags: data.tags ?? [],
    createdAt: data.createdAt,
    author: {
      firstname: data.author?.firstname ?? "",
      lastname: data.author?.lastname ?? "",
      department: data.author?.department ?? null,
      avatar: data.author?.avatar ?? null,
      email: data.author?.email ?? null,
    },
    attachments: data.attachments ?? [],
  };
}

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
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
  const imageUrl = resolveImage(article.image);
  const desc = article.description || "ข่าวประชาสัมพันธ์ สำนักสาธารณสุขและสิ่งแวดล้อม";

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

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">หน้าแรก</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/news/news-updates">ข่าวประชาสัมพันธ์</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[50ch] truncate">{article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <NewsArticleView article={article} />
    </div>
  );
}
