import Link from "next/link";
import Image from "next/image";
const Page = () => {
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
            ไม่พบข้อมูลแบนเนอร์ส่วนที่1นี้
          </h1>
          <p className="text-base text-base-content/80">
            ขออภัย! ไม่พบแบนเนอร์ส่วนที่1ที่คุณค้นหา หรือแบนเนอร์ส่วนที่1นี้อาจถูกลบออกจากระบบแล้ว
          </p>
        </div>

        {/* Back Button */}
        <Link href="/admin/banner/video" className="btn btn-primary btn-wide">
          กลับไปหน้าแบนเนอร์ส่วนที่1
        </Link>
      </div>
    </main>
  )
}

export default Page