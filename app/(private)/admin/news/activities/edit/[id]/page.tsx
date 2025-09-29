import NewsEdit from "@/features/admin/components/NewsForm/Edit/NewsEdit"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "แก้ไขกิจกรรมของสำนัก | แดชบอร์ดผู้ดูแลระบบ",
        description: `กำลังแก้ไขข้อมูลกิจกรรมของสำนัก รหัส ${id}`,
        keywords: ["แก้ไขกิจกรรมของสำนัก", "กิจกรรมของสำนัก", "Admin Edit Activities"],
        robots: {
            index: false,
            follow: false,
        },
    };
}

const page = () => {
  return (
    <NewsEdit
      type="activity"
      apiFetchBase="/api/activities"
      apiUpdateBase="/api/activities/edit"
      redirectPath="/admin/news/activities"
    />
  )
}

export default page
