import type { RelatedItem } from "@/components/News/Content/related/utils";

export const NEWS_POOL: RelatedItem[] = [
  {
    id: "n-002", // ตัวปัจจุบันที่คุณใช้ในเดโม
    title: "รายงานสถานการณ์ PM2.5 และมาตรการเมืองสีเขียวไตรมาส 4",
    href: "/demo/modern-news", // หรือ /news/news-updates/n-002
    image: "https://cdn.pixabay.com/photo/2017/08/21/10/49/plant-2664872_960_720.jpg",
    tags: ["PM2.5", "สิ่งแวดล้อม", "นโยบายเมือง"],
    createdAt: new Date().toISOString(),
    subtitle: "สำนักสาธารณสุขฯ",
  },
  {
    id: "n-003",
    title: "เพิ่มจุดวัดคุณภาพอากาศในชุมชน 12 แห่ง",
    href: "/news/news-updates/n-003",
    image: "https://cdn.pixabay.com/photo/2023/06/02/10/06/nature-8035211_960_720.jpg",
    tags: ["PM2.5", "เซ็นเซอร์", "ชุมชน"],
    createdAt: "2025-09-10",
    subtitle: "กองสิ่งแวดล้อม",
  },
  {
    id: "n-004",
    title: "ทางเดิน–จักรยานเชื่อมสวน 3 แห่ง เปิดใช้อย่างเป็นทางการ",
    href: "/news/news-updates/n-004",
    image: "https://cdn.pixabay.com/photo/2023/12/06/08/41/mountain-8433234_1280.jpg",
    tags: ["เมืองสีเขียว", "โครงสร้างพื้นฐาน", "ชุมชน"],
    createdAt: "2025-08-21",
    subtitle: "สำนักผังเมือง",
  },
  {
    id: "n-005",
    title: "คูน้ำสาธารณะสะอาดขึ้น 40% จากโครงการ Big Cleaning",
    href: "/news/news-updates/n-005",
    image: "https://cdn.pixabay.com/photo/2024/12/05/18/44/mountain-9247234_1280.jpg",
    tags: ["ชุมชน", "สิ่งแวดล้อม", "Big Cleaning"],
    createdAt: "2025-10-05",
    subtitle: "ฝ่ายสิ่งแวดล้อม",
  },
];