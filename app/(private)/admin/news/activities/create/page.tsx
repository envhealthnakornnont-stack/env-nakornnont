import NewsCreate from "@/features/admin/components/NewsForm/Create/NewsCreate"

export const metadata = {
  title: "เพิ่มกิจกรรมใหม่ | แดชบอร์ดผู้ดูแลระบบ",
  description: "เพิ่มกิจกรรมใหม่เข้าสู่ระบบของหน่วยงาน",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <NewsCreate
        type="activity"
        apiEndpoint="/api/activities/create"
        redirectPath="/admin/news/activities"
      />
  )
}

export default page