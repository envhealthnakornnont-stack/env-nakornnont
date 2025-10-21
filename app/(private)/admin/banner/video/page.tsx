import ManagementPage from "@/features/admin/components/BannerManagement/ManagementPage"

export const metadata = {
  title: "จัดการแบนเนอร์ประกาศ | แดชบอร์ดผู้ดูแลระบบ",
  description: "ดูรายการแบนเนอร์ประกาศ พร้อมตัวเลือกในการแก้ไขหรือลบ",
  keywords: ["แบนเนอร์", "จัดการแบนเนอร์", "Admin Dashboard", "แอดมิน", "แบนเนอร์วิดีโอ"],
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <ManagementPage
      management="carousel-img"
      getsApi="/api/banner/video"
      createLink="/admin/banner/video/create"
      editLink="/admin/banner/video/edit"
      deleteApi="/api/banner/video/delete" />
  )
}

export default page