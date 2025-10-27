import type { RelatedItem } from "@/components/News/Content/related/utils";

export const ACTIVITY_POOL: RelatedItem[] = [
  {
    id: "a-002", // ตัวปัจจุบันในเดโม
    title: "Kick-off โครงการชุมชนสะอาด ปลอดยุงลาย เขตตลาดบางกระสอ",
    href: "/demo/modern-activity",
    image: "https://cdn.pixabay.com/photo/2018/06/11/15/15/asia-3468649_1280.jpg",
    tags: ["ชุมชน", "สุขาภิบาล", "ยุงลาย", "Big Cleaning"],
    createdAt: new Date().toISOString(),
    subtitle: "ฝ่ายสิ่งแวดล้อม",
  },
  {
    id: "a-003",
    title: "อาสาสมัครสิ่งแวดล้อมอบรมคัดแยกขยะที่ต้นทาง",
    href: "/activities/a-003",
    image: "https://cdn.pixabay.com/photo/2017/04/26/15/59/phra-nang-2262912_1280.jpg",
    tags: ["ชุมชน", "คัดแยกขยะ", "สิ่งแวดล้อม"],
    createdAt: "2025-09-18",
    subtitle: "งานส่งเสริมสุขภาพ",
  },
  {
    id: "a-004",
    title: "พ่นหมอกควันป้องกันยุงลาย 5 ชุมชน",
    href: "/activities/a-004",
    image: "https://cdn.pixabay.com/photo/2017/03/23/01/12/koh-nang-yuan-2166982_960_720.jpg",
    tags: ["ยุงลาย", "สุขาภิบาล", "ชุมชน"],
    createdAt: "2025-10-12",
    subtitle: "งานควบคุมโรค",
  },
  {
    id: "a-005",
    title: "Big Cleaning Day ตลาดเทศบาล (รอบพิเศษ)",
    href: "/activities/a-005",
    image: "https://cdn.pixabay.com/photo/2019/11/10/16/12/the-island-4616178_960_720.jpg",
    tags: ["Big Cleaning", "ชุมชน", "ความสะอาด"],
    createdAt: "2025-10-01",
    subtitle: "ฝ่ายสิ่งแวดล้อม",
  },
];