import CreateEServiceForm from "@/features/admin/components/E-ServiceForm/Create/E-ServiceCreate"

export const metadata = {
  title: "เพิ่มบริการ E-Service ใหม่ | แดชบอร์ดผู้ดูแลระบบ",
  description: "แบบฟอร์มสำหรับเพิ่มบริการ E-Service ใหม่เข้าสู่ระบบ",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <CreateEServiceForm/>
  )
}

export default page