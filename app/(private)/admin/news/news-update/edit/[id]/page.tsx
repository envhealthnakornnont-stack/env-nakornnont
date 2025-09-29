import NewsEdit from "@/features/admin/components/NewsForm/Edit/NewsEdit"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "แก้ไขข่าวประชาสัมพันธ์ | แดชบอร์ดผู้ดูแลระบบ",
        description: `กำลังแก้ไขข้อมูลข่าวประชาสัมพันธ์ รหัส ${id}`,
        keywords: ["แก้ไขข่าวประชาสัมพันธ์", "ข่าวประชาสัมพันธ์", "Admin Edit News"],
        robots: {
            index: false,
            follow: false,
        },
    };
}

const page = () => {
  return (
    <NewsEdit
      type="news"
      apiFetchBase="/api/news"
      apiUpdateBase="/api/news/edit"
      redirectPath="/admin/news/news-update"
    />
  )
}

export default page