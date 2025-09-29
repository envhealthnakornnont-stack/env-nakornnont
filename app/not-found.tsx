import Link from "next/link";
import Image from "next/image";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-base-100 text-base-content">
      <div className="max-w-xl text-center">
        <Image
          src="/illustrations/404-activity.svg" // คุณสามารถเปลี่ยน path ได้
          alt="Not Found Illustration"
          width={400}
          height={300}
          className="mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold mb-4 text-error">ไม่พบหน้าที่คุณร้องขอ</h1>
        <p className="text-lg mb-6">
          ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา อาจถูกลบหรือมีการเปลี่ยนแปลง URL
        </p>
        <Link href="/" className="btn btn-primary">
          กลับสู่หน้าแรก
        </Link>
      </div>
    </div>
  );
}