import UserEdit from "@/features/admin/components/UserForm/Edit/UserEdit";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "แก้ไขข้อมูลผู้ใช้งาน | แดชบอร์ดผู้ดูแลระบบ",
        description: `กำลังแก้ไขข้อมูลผู้ใช้งาน รหัส ${id}`,
        keywords: ["แก้ไขผู้ใช้งาน", "ผู้ใช้งาน", "Admin Edit Users"],
        robots: {
            index: false,
            follow: false,
        },
    };
}

const EditUserForm = () => {
  return (
    <UserEdit />
  );
};

export default EditUserForm;
