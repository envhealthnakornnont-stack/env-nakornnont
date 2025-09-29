import PersonelEdit from "@/features/admin/components/PersonnelForm/Edit/PersonelEdit";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "แก้ไขข้อมูลบุคลากร | แดชบอร์ดผู้ดูแลระบบ",
        description: `กำลังแก้ไขข้อมูลบุคลากร รหัส ${id}`,
        keywords: ["แก้ไขบุคลากร", "บุคลากร", "Admin Edit Personnel"],
        robots: {
            index: false,
            follow: false,
        },
    };
}

const page = () => {
  return (
    <PersonelEdit/>
  )
}

export default page