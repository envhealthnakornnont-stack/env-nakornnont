import PersonelCreate from "@/features/admin/components/PersonnelForm/Create/PersonelCreate";

export const metadata = {
  title: "เพิ่มบุคลากรใหม่ | แดชบอร์ดผู้ดูแลระบบ",
  description: "เพิ่มข้อมูลบุคลากรเข้าสู่ระบบของหน่วยงาน",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <PersonelCreate/>
  )
}

export default page