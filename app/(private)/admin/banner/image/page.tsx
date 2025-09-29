import ManagementPage from "@/features/admin/components/BannerManagement/ManagementPage"

export const metadata = {
    title: "จัดการแบนเนอร์ภาพ | แดชบอร์ดผู้ดูแลระบบ",
    description: "ดูรายการแบนเนอร์ภาพทั้งหมด พร้อมตัวเลือกในการแก้ไขหรือลบ",
    keywords: ["แบนเนอร์", "จัดการแบนเนอร์", "Admin Dashboard", "แอดมิน", "แบนเนอร์ภาพ"],
    robots: {
        index: false,
        follow: false,
    },
};

const page = () => {
  return (
    <ManagementPage getsApi="/api/banner/image" createLink="/admin/banner/image/create" editLink="/admin/banner/image/edit" deleteApi="/api/banner/image/delete"/>
  )
}

export default page