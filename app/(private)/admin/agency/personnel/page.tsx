import ManagementPage from "@/features/admin/components/Management/ManagementPage"

export const metadata = {
  title: "จัดการบุคลากร | แดชบอร์ดผู้ดูแลระบบ",
  description: "ดูและจัดการข้อมูลบุคลากรภายในหน่วยงาน",
  robots: {
    index: false,
    follow: false,
  },
};


const page = () => {
  return (
    <ManagementPage getsApi="/api/agency/personnel" createLink="/admin/agency/personnel/create" editLink="/admin/agency/personnel/edit/" deleteApi="/api/agency/personnel/delete/" />
  )
}

export default page 