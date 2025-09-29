import ManagementPage from "@/features/admin/components/Management/ManagementPage"

export const metadata = {
  title: "จัดการข่าวประชาสัมพันธ์ | แดชบอร์ดผู้ดูแลระบบ",
  description: "ดูและจัดการข่าวประชาสัมพันธ์ทั้งหมดของหน่วยงาน",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <ManagementPage getsApi="/api/news" createLink="/admin/news/news-update/create" editLink="/admin/news/news-update/edit/" deleteApi="/api/news/delete/"/>
  )
}

export default page