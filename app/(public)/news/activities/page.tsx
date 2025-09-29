import News from "@/features/users/components/News/News"
import { ActivitiesItems } from "@/types/publicTypes";

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
  alternates: {
    canonical: "/news/activities",
  },
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

const fetchActivities = async () => {
    const baseURL =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${baseURL}/api/activities`, {
            next: { revalidate: 30 }
        });
        const data = await res.json();
        const activities = data.map((item: ActivitiesItems) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            image: item.image,
            content: item.content || "ไม่มีคำอธิบาย",
            author: {
                firstname: item.author.firstname,
                lastname: item.author.lastname,
                department: item.author.department,
            },
            createdAt: formatDateToThai(item.createdAt),
        }));
        return activities;
    } catch (error) {
        console.log("Error fetching activities:", error);
        return [];
    }
};

const formatDateToThai = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long", // "long" => มกราคม, "short" => ม.ค.
        day: "numeric",
    });
};

const page = async () => {
    const activitiesData = await fetchActivities();
    return (
        <News
            newsData={activitiesData}
            title="กิจกรรมของสำนัก"
            itemsPerPage={6}
            showPagination={true}
            showViewAll={false}
            showBreadcrumbs={true}
            cardType="type2"
        />
    )
}

export default page