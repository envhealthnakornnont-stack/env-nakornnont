import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorInfo from "@/features/users/components/News/AuthorInfo";
import ShareButton from "@/features/users/components/News/ShareButton";
import { NewsItem } from "@/types/publicTypes";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const baseURL =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const defaultImage = `/logo-nonthaburi.jpg`; 
    const canonicalUrl = `/news/news-updates/${id}`;

    try {
        const res = await fetch(`${baseURL}/api/news/${id}`, {
            next: { revalidate: 30 }
        });

        if (!res.ok) {
            return {
                title: "ไม่พบข้อมูลข่าว",
                description: "ข่าวที่คุณกำลังค้นหาอาจถูกลบหรือไม่มีอยู่จริง",
                alternates: {
                    canonical: canonicalUrl,
                },
                keywords: ["ข่าวประชาสัมพันธ์", "เทศบาล", "นครนนท์", "สาธารณสุข"],
            };
        }

        const data = await res.json();
        const imageUrl = data.image?.startsWith("/uploads")
            ? `/api/uploads${data.image}`
            : `${data.image || defaultImage}`;
        const description = data.description?.replace(/<[^>]*>?/gm, "")?.slice(0, 160) || "ไม่มีคำอธิบายสำหรับข่าวนี้";

        return {
            title: `${data.title} | สำนักสาธารณสุขและสิ่งแวดล้อมเทศบาลนครนนทบุรี`,
            description: description,
            keywords: [
                data.title,
                "ข่าวประชาสัมพันธ์",
                "เทศบาล",
                "นครนนท์",
                "สาธารณสุข",
                data.author?.department || "",
            ],
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title: `${data.title} | ข่าวประชาสัมพันธ์`,
                description: description,
                images: [{ url: imageUrl, width: 1200, height: 630 }],
                url: canonicalUrl,
                siteName: "สำนักสาธารณสุขและสิ่งแวดล้อมเทศบาลนครนนทบุรี",
                type: "article",
                locale: "th_TH",
            },
            twitter: {
                card: "summary_large_image",
                title: `${data.title}`,
                description: description,
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("generateMetadata error:", error);
        return {
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถโหลดข้อมูล metadata ได้",
            alternates: {
                canonical: canonicalUrl,
            },
            keywords: ["ข่าว", "เทศบาล", "เกิดข้อผิดพลาด"],
        };
    }
}

const fetchNewById = async (id: string) => {
    const baseURL =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
        const res = await fetch(`${baseURL}/api/news/${id}`, {
            next: { revalidate: 30 }
        });
        const data = await res.json()
        const news: NewsItem = {
            id: data.id,
            title: data.title,
            slug: data.slug,
            image: data.image,
            description: data.description,
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
        return news;
    } catch (error) {
        console.log(`Error fetching news by Id ${id}:`, error);
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

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const newsItem = await fetchNewById(id);

    if (!newsItem) {
        return notFound();
    }

    const breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: "ข้อมูลข่าวสาร", href: "/news/news-updates" },
        { label: "ข่าวประชาสัมพันธ์", href: "/news/news-updates" },
        { label: newsItem.title, isCurrent: true },
    ];

    return (
        <div className="px-10 xl:px-20 py-5 xl:py-10">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-3">
                <h1 className="sm:text-3xl text-2xl font-bold">{newsItem.title}</h1>
                <div className="flex w-full flex-col border-opacity-50">
                    <div className="divider"></div>
                </div>
            </div>
            <div className="flex items-center pb-5 max-w-[1480px] mx-auto">
                <AuthorInfo name={`${newsItem.author.firstname} ${newsItem.author.lastname}`} department={newsItem.author.department} date={newsItem.createdAt} image={newsItem.author.avatar} email={newsItem.author.email} />
                <div className="px-4">
                    <ShareButton />
                </div>
            </div>
            <div className="editor-content prose prose-sm lg:prose-base max-w-[1480px] mx-auto">
                <div className="max-w-[1480px]" dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            </div>
        </div>
    )
}

export default page