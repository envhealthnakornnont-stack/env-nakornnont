import Drawer from "@/features/admin/components/NavbarDrawer/Drawer"

export const metadata = {
  title: "แดชบอร์ดผู้ดูแลระบบ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description: "ระบบจัดการข้อมูลข่าวสาร แบนเนอร์ และเนื้อหาเว็บไซต์สำหรับเจ้าหน้าที่ผู้ดูแลระบบ",
  keywords: ["Admin Dashboard", "ระบบจัดการเว็บไซต์", "แอดมิน", "สำนักสาธารณสุข"],
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <Drawer>
                {children}
            </Drawer>
        </>
    )
}   