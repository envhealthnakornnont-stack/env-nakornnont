import NewsCreate from "@/features/admin/components/NewsForm/Create/NewsCreate"

export const metadata = {
  title: "เพิ่มข่าวประชาสัมพันธ์ใหม่ | แดชบอร์ดผู้ดูแลระบบ",
  description: "เพิ่มข่าวประชาสัมพันธ์ใหม่เข้าสู่ระบบของหน่วยงาน",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <NewsCreate
        type="news"
        apiEndpoint="/api/news/create"
        redirectPath="/admin/news/news-update"
      />
  )
}

export default page