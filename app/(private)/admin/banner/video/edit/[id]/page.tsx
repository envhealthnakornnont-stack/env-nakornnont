import BannerVideoEdit from "@/features/admin/components/BannerForm/Video//Edit/BannerVideoEdit"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "แก้ไขแบนเนอร์ | แดชบอร์ดผู้ดูแลระบบ",
        description: `กำลังแก้ไขข้อมูลแบนเนอร์รหัส ${id}`,
        keywords: ["แก้ไขแบนเนอร์", "แบนเนอร์วิดีโอ", "Admin Edit Banner"],
        robots: {
            index: false,
            follow: false,
        },
    };
}

const page = () => {
  return (
    <BannerVideoEdit/>
  )
}

export default page