import EditEservice from '@/features/admin/components/E-ServiceForm/Edit/E-ServiceEdit'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "แก้ไขบริการ E-Service | แดชบอร์ดผู้ดูแลระบบ",
        description: `กำลังแก้ไขข้อมูลบริการ E-Service รหัส ${id}`,
        keywords: ["แก้ไขบริการ E-Service", "บริการ E-Service", "Admin Edit E-Service"],
        robots: {
            index: false,
            follow: false,
        },
    };
}

const page = () => {
  return (
    <EditEservice/>
  )
}

export default page