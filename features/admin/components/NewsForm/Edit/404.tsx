import Link from "next/link";
import Image from "next/image";

interface TypeProps {
    type: "activity" | "news";
}

const Page = ({ type }: TypeProps) => {
    return (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-16 text-center">
            <div className="w-full max-w-2xl">
                {/* Illustration */}
                <div className="mb-8">
                    <Image
                        src="/illustrations/404-activity.svg"
                        alt="Not Found Illustration"
                        width={600}
                        height={400}
                        className="w-full h-auto mx-auto"
                        priority
                    />
                </div>

                {/* Message */}
                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-error mb-2">
                        {type === "activity" && 'ไม่พบข้อมูลกิจกรรมนี้'}
                        {type === "news" && 'ไม่พบข้อมูลข่าวประชาสัมพันธ์นี้'}
                    </h1>
                    <p className="text-base text-base-content/80">
                        {type === "activity" && 'ขออภัย! ไม่พบกิจกรรมที่คุณค้นหา หรือกิจกรรมนี้อาจถูกลบออกจากระบบแล้ว'}
                        {type === "news" && 'ขออภัย! ไม่พบข่าวประชาสัมพันธ์ที่คุณค้นหา หรือข่าวประชาสัมพันธ์นี้อาจถูกลบออกจากระบบแล้ว'}
                    </p>
                </div>

                {/* Back Button */}
                <Link href={`/admin/news/${type === "activity" ? 'activities' : 'news-update'}`} className="btn btn-primary btn-wide">
                    {type === "activity" && 'กลับไปหน้ากิจกรรม'}
                    {type === "news" && 'กลับไปหน้าข่าวประชาสัมพันธ์'}
                </Link>
            </div>
        </main>
    )
}

export default Page