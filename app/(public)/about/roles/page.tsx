import RolesSection from "@/features/users/components/Roles/RolesSection"

export const metadata = {
  title: "อำนาจหน้าที่ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description: "อำนาจหน้าที่ของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรีในการดูแล ส่งเสริม และป้องกันสุขภาพของประชาชน",
  alternates: {
    canonical: `/about/roles`,
  },
  keywords: [
    "อำนาจหน้าที่",
    "สำนักสาธารณสุขและสิ่งแวดล้อม",
    "เทศบาล",
    "เทศบาลนครนนทบุรี",
    "หน่วยงานราชการ",
  ],
  openGraph: {
    title: "อำนาจหน้าที่ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description: "ดูรายละเอียดอำนาจหน้าที่และภารกิจของหน่วยงาน",
    url: `/about/roles`,
    images: ["/logo-nonthaburi.jpg"],
    siteName: "เทศบาลนครนนทบุรี",
    type: "article",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "อำนาจหน้าที่ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description: "แสดงอำนาจหน้าที่ของสำนักสาธารณสุข เทศบาลนครนนทบุรี",
    images: [`/logo-nonthaburi.jpg`],
  },
};

const page = () => {
  return <RolesSection />
}

export default page