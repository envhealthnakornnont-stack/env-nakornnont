import BannerImageCreate from '@/features/admin/components/BannerForm/Image/Create/BannerImageCreate'

export const metadata = {
  title: "เพิ่มแบนเนอร์ใหม่ | แดชบอร์ดผู้ดูแลระบบ",
  description: "เพิ่มแบนเนอร์ใหม่เพื่อแสดงบนหน้าเว็บไซต์ พร้อมระบุลำดับและสถานะ",
  keywords: ["เพิ่มแบนเนอร์", "อัปโหลดรูป", "Admin Create Banner", "สร้างแบนเนอร์"],
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <BannerImageCreate/>
  )
}

export default page