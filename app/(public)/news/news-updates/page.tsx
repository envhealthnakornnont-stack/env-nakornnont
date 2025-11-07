import NewsGrid from "@/components/News/NewsGrid";
import { Newsish } from "@/components/News/types";

type PageSearchParams = {
  q?: string;
  tag?: string;
  status?: string;
  sort?: "new" | "old" | "published";
  page?: string;
  perPage?: string;
};

export const metadata = {
  title: "ข่าวประชาสัมพันธ์ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "ติดตามข่าวสาร กิจกรรมสำคัญ และประกาศจากสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี เพื่อประชาชนในพื้นที่ได้รับข้อมูลที่ถูกต้องและทันเหตุการณ์",
  keywords: [
    "ข่าวประชาสัมพันธ์",
    "ข่าวสารราชการ",
    "เทศบาล",
    "กิจกรรมสาธารณสุข",
    "ข้อมูลข่าวสาร",
    "เทศบาลนครนนทบุรี",
  ],
  alternates: {
    canonical: "/news/news-updates",
  },
  openGraph: {
    title: "ข่าวประชาสัมพันธ์ | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "อัปเดตข่าวสารและกิจกรรมจากหน่วยงานด้านสาธารณสุขของเทศบาลนครนนทบุรี ทั้งข่าวทั่วไปและประกาศทางราชการ",
    url: "/news/news-updates",
    siteName: "เว็บไซต์เทศบาลนครนนทบุรี",
    locale: "th_TH",
    type: "website",
    images: ["/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ข่าวประชาสัมพันธ์ | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "รวมข่าวสารและกิจกรรมจากเทศบาลนครนนทบุรี สำหรับประชาชนในพื้นที่",
    images: ["/logo-nonthaburi.jpg"],
  },
};


const formatDateToThai = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ---- Types for API payload (no 'any') ----
type ApiAuthor = {
  firstname?: string | null;
  lastname?: string | null;
  department?: string | null;
};
type ApiNewsItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  contentHtml?: string | null;
  image?: string | null;
  author?: ApiAuthor | null;
  createdAt: string; // ISO
};
type ApiListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export default async function Page({ searchParams, }: { searchParams: Promise<PageSearchParams>; }) {
  const sp = await searchParams;
  const {
    q = "",
    tag = "",
    status = "",
    sort = "new",
    page = "1",
    perPage = "12",
  } = sp || {};

  // map sort UI -> API: latest|oldest|published
  const apiSort = sort === "old" ? "oldest" : sort === "published" ? "published" : "latest";

  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const params = new URLSearchParams({
    q,
    tag,
    status,
    sort: apiSort,
    page: String(page),
    pageSize: String(perPage),
  });

  // ใช้ cache แบบ revalidate เล็กน้อยก็ได้ หรือ no-store ถ้าอยากสดทั้งหมด
  const res = await fetch(`${baseURL}/api/news?${params.toString()}`, {
    // next: { revalidate: 30 },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <NewsGrid
        mode="index"
        type="news"
        title="ข่าวประชาสัมพันธ์"
        items={[]}
        basePath="/news/news-updates"
        defaultPerPage={Number(perPage)}
        serverTotal={0}
        serverPage={Number(page)}
        serverPageSize={Number(perPage)}
      />
    );
  }

  const payload = (await res.json()) as ApiListResponse<ApiNewsItem>;
  const items: Newsish[] = (payload.items ?? []).map((it) => ({
    id: it.id,
    title: it.title,
    slug: it.slug,
    description: it.description ?? "ไม่มีคำอธิบาย",
    content: it.contentHtml ?? undefined,
    image: it.image ?? null,
    author: {
      firstname: it.author?.firstname ?? "",
      lastname: it.author?.lastname ?? "",
      department: it.author?.department ?? "",
    },
    createdAt: formatDateToThai(it.createdAt),
    createdAtISO: it.createdAt,
  }));

  return (
    <NewsGrid
      mode="index"
      type="news"
      title="ข่าวประชาสัมพันธ์"
      items={items}
      basePath="/news/news-updates"
      defaultPerPage={Number(payload.pageSize ?? perPage)}
      serverTotal={Number(payload.total ?? 0)}
      serverPage={Number(payload.page ?? page)}
      serverPageSize={Number(payload.pageSize ?? perPage)}
    />
  );
}