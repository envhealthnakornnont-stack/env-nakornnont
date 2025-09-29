import PublicHealthPromotionSection from "@/features/users/components/Departments/PublicHealthPromotionSection";

export const metadata = {
  title: "ส่วนส่งเสริมสาธารณสุข | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "ข้อมูลภารกิจของฝ่ายวิชาการและการประเมินผล และฝ่ายส่งเสริมสาธารณสุข ครอบคลุมงานนโยบายสาธารณสุข การติดตามแผนสุขภาพ งานอาสาสมัครสาธารณสุข งานส่งเสริมคุณภาพชีวิตผู้สูงอายุ และงานสัตวแพทย์",
  keywords: [
    "ส่วนส่งเสริมสาธารณสุข",
    "งานอสม.",
    "สุขภาพชุมชน",
    "ประเมินผลสุขภาพ",
    "งานสัตวแพทย์",
    "งานสุขศึกษา",
    "เทศบาลนครนนทบุรี",
  ],
  alternates: {
    canonical: "/departments/public-health-promotion",
  },
  openGraph: {
    title: "ส่วนส่งเสริมสาธารณสุข | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "รวมข้อมูลภารกิจหลักของงานส่งเสริมสุขภาพ งานอสม. การประเมินผลสุขภาพ และงานบริการสัตวแพทย์ในพื้นที่เทศบาลนครนนทบุรี",
    url: "/departments/public-health-promotion",
    type: "article",
    siteName: "เว็บไซต์เทศบาลนครนนทบุรี",
    locale: "th_TH",
    images: ["/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ส่วนส่งเสริมสาธารณสุข | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description: "ภารกิจด้านส่งเสริมสุขภาพ การติดตามประเมินผล และงานสัตวแพทย์",
    images: ["/logo-nonthaburi.jpg"],
  },
};

const page = () => {
  return <PublicHealthPromotionSection/>
}

export default page