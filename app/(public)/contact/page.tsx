import ContactSection from "@/features/users/components/Contact/ContactSection"

export const metadata = {
  title: "ติดต่อเรา | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "ติดต่อสอบถามข้อมูล บริการแจ้งปัญหา หรือเสนอข้อคิดเห็นมายังสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี ได้ที่นี่",
  keywords: [
    "ติดต่อเทศบาล",
    "ติดต่อเรา",
    "สำนักสาธารณสุข",
    "สิ่งแวดล้อม",
    "เทศบาลนครนนทบุรี",
    "แจ้งปัญหา",
    "สอบถามข้อมูล",
    "ช่องทางติดต่อ",
    "ข้อมูลการติดต่อ",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "ติดต่อเรา | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "รวมข้อมูลช่องทางการติดต่อหน่วยงานสาธารณสุขและสิ่งแวดล้อม พร้อมแผนที่และแบบฟอร์มออนไลน์",
    url: `/contact`,
    siteName: "เทศบาลนครนนทบุรี",
    images: ["/logo-nonthaburi.jpg"],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ติดต่อเรา | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "สอบถามข้อมูล แจ้งปัญหา หรือติดต่อราชการกับสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    images: ["/logo-nonthaburi.jpg"],
  },
};

const page = () => {
  return <ContactSection/>
}

export default page