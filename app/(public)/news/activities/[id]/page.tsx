// app/activities/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ActivityArticle as ActivityType } from "@/components/News/Content/ActivityArticle/types";
import ActivityArticle from "@/components/News/Content/ActivityArticle/ActivityArticle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { resolveUpload } from "@/components/News/Content/ActivityArticle/utils";

// -------- data helpers --------
async function fetchActivity(id: string): Promise<ActivityType | null> {
  const base =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/activities/${id}`, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  const data = await res.json();

  // ปรับให้ตรงกับ types ที่เรากำหนด
  const item: ActivityType = {
    id: data.id,
    title: data.title,
    content: data.content || "",
    createdAt: data.createdAt,
    location: data.location ?? null,
    organizer: data.organizer ?? null,
    gallery: Array.isArray(data.gallery)
      ? data.gallery.map((g: any) => ({ src: g.src, alt: g.alt }))
      : [],
    attachments: data.attachments ?? [],
    tags: data.tags ?? [],
  };

  return item;
}

const pickOgImage = (item: ActivityType) => {
  const first = item.gallery?.[0]?.src;
  return first ? resolveUpload(first) : "/logo-nonthaburi.jpg";
};

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();

// -------- metadata --------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchActivity(id);
  const canonical = `/activities/${id}`;

  if (!item) {
    return {
      title: "ไม่พบข้อมูลกิจกรรม",
      description: "กิจกรรมที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่จริง",
      alternates: { canonical },
    };
  }

  const desc =
    stripHtml(item.content).slice(0, 160) ||
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
  const item = await fetchActivity(id);
  if (!item) return notFound();

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">หน้าแรก</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/activities">กิจกรรมของสำนัก</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[50ch] truncate">{item.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ActivityArticle item={item} />
    </div>
  );
}
