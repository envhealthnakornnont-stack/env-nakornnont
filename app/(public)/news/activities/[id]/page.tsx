import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorInfo from "@/features/users/components/News/AuthorInfo";
import ShareButton from "@/features/users/components/News/ShareButton";
import { ActivityItem } from "@/types/publicTypes";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const baseURL =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const canonicalUrl = `/news/activities/${id}`;
    const defaultImage = `/logo-nonthaburi.jpg`;
    try {
        const res = await fetch(`${baseURL}/api/activities/${id}`, {
            next: { revalidate: 30 },
        });

        if (!res.ok) {
            return {
                title: "ไม่พบข้อมูลกิจกรรม",
                description: "กิจกรรมที่คุณค้นหาอาจไม่มีอยู่หรือถูกลบไปแล้ว",
                alternates: { canonical: canonicalUrl },
                keywords: ["กิจกรรม", "เทศบาล", "สาธารณสุข", "นครนนท์"],
            };
        }

        const data = await res.json();

        const imageUrl = data.image?.startsWith("/uploads")
            ? `/api/uploads${data.image}`
            : `${data.image || defaultImage}`;

        const description = data.title || "ไม่มีคำอธิบายสำหรับกิจกรรมนี้";

        const title = `${data.title} | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี`;

        return {
            title,
            description,
            keywords: [
                data.title,
                "กิจกรรม",
                "ข่าวสาร",
                "เทศบาล",
                "นครนนท์",
                "สาธารณสุข",
                data.author?.department || "",
            ],
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                images: [{ url: imageUrl, width: 1200, height: 630 }],
                siteName: "เว็บไซต์เทศบาลนครนนทบุรี",
                type: "article",
                locale: "th_TH",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("generateMetadata (activities) error:", error);
        return {
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถโหลดข้อมูล metadata ได้",
            alternates: { canonical: canonicalUrl },
            keywords: ["กิจกรรม", "เทศบาล", "เกิดข้อผิดพลาด"],
        };
    }
}

const fetchActivity = async (id: string) => {
    const baseURL =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${baseURL}/api/activities/${id}`, {
            next: { revalidate: 30 }
        });
        const data = await res.json()
        const activities: ActivityItem = {
            id: data.id,
            title: data.title,
            slug: data.slug,
            image: data.image,
            content: data.content || "ไม่มีคำอธิบาย",
            author: {
                firstname: data.author.firstname,
                lastname: data.author.lastname,
                department: data.author.department,
                avatar: data.author.avatar,
                email: data.author.email
            },
            createdAt: formatDateToThai(data.createdAt),
        };
        return activities;
    } catch (error) {
        console.log("Error fetching activities:", error);
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

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const activity = await fetchActivity(id)

    if (!activity) {
        return notFound();
    }

    const breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: "ข้อมูลข่าวสาร", href: "/news/activities" },
        { label: "กิจกรรมของสำนัก", href: "/news/activities" },
        { label: activity.title, isCurrent: true },
    ];

    return (
        <div>
            <div className="px-10 py-5 xl:px-20 xl:py-10">
                <Breadcrumbs items={breadcrumbs} />
                <div className="mt-3">
                    <h1 className="sm:text-3xl text-2xl font-bold">{activity.title}</h1>
                    <div className="flex w-full flex-col border-opacity-50">
                        <div className="divider"></div>
                    </div>
                </div>
                <div className="flex items-center pb-5 max-w-[1480px] mx-auto">
                    <AuthorInfo name={`${activity.author.firstname} ${activity.author.lastname}`} department={activity.author.department} date={activity.createdAt} image={activity.author.avatar} email={activity.author.email} />
                    <div className="px-4">
                        <ShareButton />
                    </div>
                </div>
                <div className="editor-content prose prose-sm lg:prose-base max-w-[1440px] mx-auto">
                    <div className="max-w-[1440px]" dangerouslySetInnerHTML={{ __html: activity.content }} />
                </div>
            </div>
        </div>
    )
}

export default Page