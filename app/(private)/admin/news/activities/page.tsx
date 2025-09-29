import ManagementPage from "@/features/admin/components/Management/ManagementPage"

export const metadata = {
  title: "จัดการกิจกรรมของสำนัก | แดชบอร์ดผู้ดูแลระบบ",
  description: "ดูและจัดการข้อมูลกิจกรรมของสำนักทั้งหมด",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <ManagementPage getsApi="/api/activities" createLink="/admin/news/activities/create" editLink="/admin/news/activities/edit/" deleteApi="/api/activities/delete/"/>
  )
}

export default page