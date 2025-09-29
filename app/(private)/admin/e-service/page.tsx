import ManagementPage from "@/features/admin/components/Management/ManagementPage"

export const metadata = {
  title: "จัดการบริการ E-Service | แดชบอร์ดผู้ดูแลระบบ",
  description: "ดูและจัดการบริการ E-Service ทั้งหมดในระบบ",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
        <ManagementPage getsApi="/api/eservice" createLink="/admin/e-service/create" editLink="/admin/e-service/edit/" deleteApi="/api/eservice/delete/"/>
  )
}

export default page