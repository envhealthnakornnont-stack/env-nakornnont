import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import ImageLogin from "@/features/admin/components/Login/ImageLogin";
import FormLogin from "@/features/admin/components/Login/FormLogin";

export const metadata = {
  title: "เข้าสู่ระบบ | แดชบอร์ดผู้ดูแลระบบ",
  description: "เข้าสู่ระบบเพื่อจัดการและดูแลระบบเว็บไซต์อย่างปลอดภัย",
  robots: {
    index: false,
    follow: false,
  },
};

const page = async () => {
  // ดึงข้อมูลเซสชันจากเซิร์ฟเวอร์
  const session = await getServerSession(authOptions);

  // ถ้าผู้ใช้มีเซสชันอยู่แล้ว ให้รีไดเรกต์ไปยัง `/admin`
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex bg-base-100">
      <ImageLogin />
      <FormLogin />
    </div>
  )
}

export default page
