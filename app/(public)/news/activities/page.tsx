// app/(public)/news/activities/page.tsx
import NewsGrid from "@/components/News/NewsGrid";
import { Newsish } from "@/components/News/types";

export const metadata = {
  title: "กิจกรรมของสำนัก | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "รวมภาพกิจกรรม กิจกรรมรณรงค์ และการดำเนินงานต่าง ๆ ของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี เพื่อส่งเสริมสุขภาพและสิ่งแวดล้อมในชุมชน",
  keywords: [
    "กิจกรรมสาธารณสุข",
    "เทศบาลนครนนทบุรี",
    "งานรณรงค์",
    "สิ่งแวดล้อม",
    "ข่าวกิจกรรม",
    "หน่วยงานราชการ",
  ],
  alternates: { canonical: "/news/activities" },
  openGraph: {
    title: "กิจกรรมของสำนัก | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "ติดตามกิจกรรมและโครงการต่าง ๆ ที่จัดขึ้นโดยสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี เพื่อพัฒนาคุณภาพชีวิตของประชาชน",
    url: "/news/activities",
    siteName: "เว็บไซต์เทศบาลนครนนทบุรี",
    locale: "th_TH",
    type: "website",
    images: ["/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "กิจกรรมของสำนัก | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "ชมภาพและรายละเอียดกิจกรรมเพื่อสังคมจากเทศบาลนครนนทบุรี ที่จัดโดยสำนักสาธารณสุขและสิ่งแวดล้อม",
    images: ["/logo-nonthaburi.jpg"],
  },
};

function formatDateToThai(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type PageSearchParams = {
  q?: string;
  tag?: string;
  status?: string;
  sort?: "new" | "old" | "published" | "event";
  page?: string;
  perPage?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const sp = await searchParams;
  const {
    q = "",
    tag = "",
    status = "",
    sort = "new",
    page = "1",
    perPage = "12",
  } = sp || {};

  // แม็พค่าจาก UI -> API
  const apiSort =
    sort === "old" ? "oldest" : sort === "published" ? "published" : sort === "event" ? "event" : "latest";

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

  const res = await fetch(`${baseURL}/api/activities?${params.toString()}`, {
    cache: "no-store", // ให้ซิงก์กับตัวกรอง/ค้นหาแบบเรียลไทม์
  });

  if (!res.ok) {
    // fallback กรณี API ล่ม/ไม่มีผลลัพธ์
    return (
      <NewsGrid
        mode="index"
        type="activities"
        title="กิจกรรมของสำนัก"
        items={[]}
        basePath="/news/activities"
        defaultPerPage={Number(perPage)}
        serverTotal={0}
        serverPage={Number(page)}
        serverPageSize={Number(perPage)}
      />
    );
  }

  const payload = await res.json();

  const items = (payload.items ?? []).map((it: any) => ({
    id: it.id,
    title: it.title,
    slug: it.slug,
    image: it.image ?? null,
    description: "",                     // กิจกรรมไม่มี description ใน schema
    content: it.contentHtml ?? null,     // ใช้ contentHtml ตาม schema
    author: {
      firstname: it.author?.firstname ?? "",
      lastname: it.author?.lastname ?? "",
      department: it.author?.department ?? "",
    },
    createdAt: formatDateToThai(it.createdAt),
    createdAtISO: it.createdAt,
  })) as Newsish[];

  return (
    <NewsGrid
      mode="index"
      type="activities"
      title="กิจกรรมของสำนัก"
      items={items}
      basePath="/news/activities"
      defaultPerPage={Number(payload.pageSize ?? perPage)}
      serverTotal={Number(payload.total ?? 0)}
      serverPage={Number(payload.page ?? page)}
      serverPageSize={Number(payload.pageSize ?? perPage)}
    />
  );
}
