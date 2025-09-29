import BannerImageEdit from '@/features/admin/components/BannerForm/Image/Edit/BannerImageEdit'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "แก้ไขแบนเนอร์ | แดชบอร์ดผู้ดูแลระบบ",
        description: `กำลังแก้ไขข้อมูลแบนเนอร์รหัส ${id}`,
        keywords: ["แก้ไขแบนเนอร์", "แบนเนอร์ภาพ", "Admin Edit Banner"],
        robots: {
            index: false,
            follow: false,
        },
    };
}

const page = () => {
  return (
    <BannerImageEdit/>
  )
}

export default page