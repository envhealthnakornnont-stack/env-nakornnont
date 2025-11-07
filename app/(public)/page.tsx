export const dynamic = "force-dynamic";
import CalendarSection from "@/components/Calendar/CalendarSection";
import ServiceSection from "@/components/E-Service/ServiceSection";
import { EServiceItem } from "@/components/E-Service/types";
import EmergencyBannerStack from "@/components/EmergencyBanner/EmergencyBannerStack";
import QuickActionsDock from "@/components/QuickActionsDock/QuickActionsDock";
import BentoPresetA from "@/components/News/BentoPresetA";
import NewsGrid from "@/components/News/NewsGrid";
import TikTokMarquee from "@/components/TikTokMarquee/TikTokMarquee";
import CarouselHeroShadcn from "@/features/users/components/Carousel/CarouselHeroShadcn";
// import Hero from "@/features/users/components/Hero/Hero";
import { CarouselImage } from "@/types/publicTypes";
import { CalendarDays, Megaphone, Newspaper, PanelsTopLeft, PartyPopper } from "lucide-react";
import { Newsish } from "@/components/News/types";

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

// ---- Types for API payload (no 'any') ----
type ApiActivityItem = {
  id: string;
  title: string;
  slug: string;
  contentHtml?: string | null;
  image?: string | null;
  author?: ApiAuthor | null;
  createdAt: string; // ISO
};


const fetchNews = async (): Promise<Newsish[]> => {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseURL}/api/news`,
      { cache: "no-store", },
      // { next: { revalidate: 30 } }
    );
    const payload = (await res.json()) as ApiListResponse<ApiNewsItem>;
    const news: Newsish[] = (payload.items ?? []).map((it) => ({
      id: it.id,
      title: it.title,
      slug: it.slug,
      description: it.description ?? "ไม่มีคำอธิบาย",
      content: it.contentHtml ?? undefined,
      image: it.image,
      author: {
        firstname: it.author?.firstname ?? "",
        lastname: it.author?.lastname ?? "",
        department: it.author?.department ?? "",
      },
      createdAt: formatDateToThai(it.createdAt),
      createdAtISO: it.createdAt,
    }));
    return news;
  } catch (error) {
    console.log("Error fetching news:", error);
    return [];
  }
};

const fetchActivities = async (): Promise<Newsish[]> => {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseURL}/api/activities`,
      { cache: "no-store", },
      // { next: { revalidate: 30 }, }
    );
    const payload = (await res.json()) as ApiListResponse<ApiActivityItem>;
    const activities: Newsish[] = (payload.items ?? []).map((it) => ({
      id: it.id,
      title: it.title,
      slug: it.slug,
      image: it.image ?? null,
      description: "", // schema กิจกรรมไม่มี description
      content: it.contentHtml ?? undefined,
      author: {
        firstname: it.author?.firstname ?? "",
        lastname: it.author?.lastname ?? "",
        department: it.author?.department ?? "",
      },
      createdAt: formatDateToThai(it.createdAt),
      createdAtISO: it.createdAt,
    }));
    return activities;
  } catch (error) {
    console.log("Error fetching activities:", error);
    return [];
  }
};

async function fetchService(): Promise<EServiceItem[]> {
  const baseURL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseURL}/api/eservice`,
      { cache: "no-store", },
      // { next: { revalidate: 30 } }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const service = data;
    return service;
  } catch (error) {
    console.error("Error fetching E-Service data:", error);
    return [];
  }
}

// async function fetcHero(): Promise<BannerImage[]> {
//   const baseURL = process.env.NODE_ENV === "development"
//     ? "http://localhost:3000"
//     : process.env.NEXT_PUBLIC_API_URL;

//   try {
//     const res = await fetch(`${baseURL}/api/banner/image`, {
//       next: {
//         revalidate: 30
//       },
//     });
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     const data = await res.json();
//     const raw: BannerImage[] = data;
//     const activeOnly = raw.filter(item => item.isActive === true);
//     return activeOnly;
//   } catch (error) {
//     console.error("Error fetching Carousel data:", error);
//     return [];
//   }
// }

const formatDateToThai = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long", // "long" => มกราคม, "short" => ม.ค.
    day: "numeric",
  });
};

async function getFeatured(): Promise<CarouselImage[]> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseURL}/api/banner/video`, { 
      // next: { revalidate: 60 }
      cache: "no-store",
    });
    const data = (await res.json()) as CarouselImage[];
    return data.slice(0, 6);
  } catch (error) {
    console.error("Error fetching Carousel data:", error);
    return [];
  }
}

const page = async () => {
  // const hero = await fetcHero();
  const service = await fetchService();
  const newsData = await fetchNews();
  const activitiesData = await fetchActivities();
  const carousel = await getFeatured();

  const h = newsData?.[0];
  const rt = activitiesData?.[0];
  const rb = activitiesData?.[1] ?? newsData?.[1];

  const banners = [
    { id: "pm25-2025-10-20", title: "แจ้งเตือน PM2.5", message: "ค่าฝุ่นสูง...", href: "/announcements/pm25", variant: "emergency" as const, ttlMs: 6 * 60 * 60 * 1000 },
    { id: "dengue-2025-10", title: "รณรงค์ไข้เลือดออก", message: "เก็บบ้าน เก็บน้ำ เก็บขยะ", href: "/announcements/dengue", variant: "warning" as const },
    { id: "clinic-extend-hrs", title: "ขยายเวลาให้บริการคลินิก", message: "จันทร์–ศุกร์ 08:30–20:00 น.", href: "/announcements/clinic-hours", variant: "info" as const, compact: true },
  ];

  const tiktoks = [
    "https://www.tiktok.com/@pr.nont/video/7486066980584295698",
    "https://www.tiktok.com/@pr.nont/video/7459298401708985607",
    "https://www.tiktok.com/@pr.nont/video/7553583597660179720",
    "https://www.tiktok.com/@pr.nont/video/7484850649696324872",
    "https://www.tiktok.com/@pr.nont/video/7506066257083436295",
    "https://www.tiktok.com/@pr.nont/video/7483430083743599890",
    "https://www.tiktok.com/@pr.nont/video/7479034274155613448",
    "https://www.tiktok.com/@pr.nont/video/7473789158788533559",
    "https://www.tiktok.com/@pr.nont/video/7559532171266886920",
    "https://www.tiktok.com/@pr.nont/video/7514247499880713490",
    "https://www.tiktok.com/@pr.nont/video/7510235395238415623",
    "https://www.tiktok.com/@pr.nont/video/7471581792881954066"
  ];

  return (
    <>
      <EmergencyBannerStack items={banners} sticky navbarHeight={74} />
      <CarouselHeroShadcn slides={carousel} />
      <QuickActionsDock
        id="quick-actions"
        items={[
          { href: "/public-services", label: "e-Service", icon: <PanelsTopLeft /> },
          { href: "/news/news-updates", label: "ข่าวประชาสัมพันธ์", icon: <Newspaper /> },
          { href: "/news/activities", label: "กิจกรรมของสำนัก", icon: <PartyPopper /> },
          { href: "#calendar", label: "ปฏิทินกิจกรรม", icon: <CalendarDays /> },
          { href: "https://nakornnont.go.th/onestopservice/inform", label: "แจ้งเรื่องร้องเรียน", icon: <Megaphone />, newTab: true },
        ]}
        title="บริการยอดนิยม"
        subtitle="ทางลัดบริการที่ใช้งานบ่อยที่สุด"
        className="-mt-6 md:-mt-10 relative z-10"
      />
      <ServiceSection
        items={service}
        headingTitle="e-Service"
        headingDescription="บริการออนไลน์ทุกที่ทุกเวลา—ใช้งานง่ายทุกอุปกรณ์"
        moreHref="/public-services"
      />
      <BentoPresetA
        hero={{ title: h.title, href: `/news/news-updates/${h.id}`, image: h.image, kicker: "ข่าวประชาสัมพันธ์" }}
        rightTop={{ title: rt.title, href: `/news/activities/${rt.id}`, image: rt.image, kicker: "กิจกรรม" }}
        rightBottom={{ title: rb.title, href: `/news/activities/${rb.id}`, image: rb.image, kicker: "กิจกรรม" }}
        headingTitle="ไฮไลท์ข่าวและกิจกรรม"
        headingSubtitle="อัพเดตข่าวสารและกิจกรรมล่าสุดจากสำนัก"
      />
      <NewsGrid mode="home" type="news" title="ข่าวประชาสัมพันธ์" items={newsData} viewAllHref="/news/news-updates" />
      <NewsGrid mode="home" type="activities" title="กิจกรรมของสำนัก" items={activitiesData} viewAllHref="/news/activities" />
      {/* <Hero hero={hero} /> */}
      <CalendarSection />
      <TikTokMarquee urls={tiktoks} />
    </>
  )
}

export default page