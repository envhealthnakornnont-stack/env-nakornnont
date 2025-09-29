import Divider from "@/components/Divider";
import { newsIcon, Megaphone } from "@/config/iconConfig";
import CalendarSection from "@/features/users/components/Calendar/CalendarSection";
import Carousel from "@/features/users/components/Carousel/Carousel";
import Service from "@/features/users/components/E-Service/Service";
import Hero from "@/features/users/components/Hero/Hero";
import News from "@/features/users/components/News/News";
import { NewsItems, ActivitiesItems, E_Service, BannerVideo, BannerImage } from "@/types/publicTypes";

const fetchNews = async (): Promise<NewsItems[]> => {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseURL}/api/news`, {
      next: { revalidate: 30 }, // cache 30 วิ
    });
    const data = await res.json();
    const activities = data.map((item: NewsItems) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description || "ไม่มีคำอธิบาย",
      content: item.content || "ไม่มีเนื้อหาข่าวประชาสัมพันธ์",
      image: item.image,
      author: {
        firstname: item.author.firstname,
        lastname: item.author.lastname,
        department: item.author.department
      },
      createdAt: formatDateToThai(item.createdAt),
    }));
    return activities;
  } catch (error) {
    console.log("Error fetching news:", error);
    return [];
  }
};

const fetchActivities = async (): Promise<ActivitiesItems[]> => {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseURL}/api/activities`, {
      next: { revalidate: 30 }, // cache 30 วิ
    });
    const data = await res.json();
    const activities = data.map((item: ActivitiesItems) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      image: item.image,
      description: item.content || "ไม่มีคำอธิบาย",
      author: {
        firstname: item.author.firstname,
        lastname: item.author.lastname,
        department: item.author.department
      },
      createdAt: formatDateToThai(item.createdAt),
    }));
    return activities;
  } catch (error) {
    console.log("Error fetching activities:", error);
    return [];
  }
};

async function fetchService(): Promise<E_Service[]> {
  const baseURL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseURL}/api/eservice`, {
      next: { revalidate: 30 }
    });
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

async function fetchCarousel(): Promise<BannerVideo[]> {
  const baseURL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseURL}/api/banner/video`, {
      next: {
        revalidate: 30
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const raw: BannerVideo[] = data;
    const activeOnly = raw.filter(item => item.isActive === true);
    return activeOnly.slice(0, 6);
  } catch (error) {
    console.error("Error fetching Carousel data:", error);
    return [];
  }
}

async function fetcHero(): Promise<BannerImage[]> {
  const baseURL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseURL}/api/banner/image`, {
      next: {
        revalidate: 30
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const raw: BannerImage[] = data;
    const activeOnly = raw.filter(item => item.isActive === true);
    return activeOnly;
  } catch (error) {
    console.error("Error fetching Carousel data:", error);
    return [];
  }
}

const formatDateToThai = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long", // "long" => มกราคม, "short" => ม.ค.
    day: "numeric",
  });
};

const page = async () => {
  const carousel = await fetchCarousel();
  const hero = await fetcHero();
  const service = await fetchService();
  const newsData = await fetchNews();
  const activitiesData = await fetchActivities();

  return (
    <>
      <Carousel carousel={carousel} />
      <Hero hero={hero} />
      <Service service={service} />
      <News newsData={newsData} title="ข่าวประชาสัมพันธ์" itemsPerPage={8} showPagination={false} showViewAll={true} showBreadcrumbs={false} viewAllLink="/news/news-updates" icon={newsIcon()} cardType="type1" />
      <Divider />
      <News newsData={activitiesData} title="กิจกรรมของสำนัก" itemsPerPage={8} showPagination={false} showViewAll={true} showBreadcrumbs={false} viewAllLink="/news/activities" icon={Megaphone()} cardType="type2" />
      <CalendarSection />
    </>
  )
}

export default page