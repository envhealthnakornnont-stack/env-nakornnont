import UserCreate from "@/features/admin/components/UserForm/Create/UserCreate"

export const metadata = {
  title: "เพิ่มผู้ใช้ใหม่ | แดชบอร์ดผู้ดูแลระบบ",
  description: "สร้างบัญชีผู้ใช้ใหม่และกำหนดสิทธิ์การใช้งานในระบบ",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <UserCreate/>
  )
}

export default page
