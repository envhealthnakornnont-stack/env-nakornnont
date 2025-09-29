import EnvironmentalHealthServicesSection from "@/features/users/components/Departments/EnvironmentalHealthServicesSection";

export const metadata = {
  title: "ส่วนบริการอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "ข้อมูลภารกิจของฝ่ายจัดการมูลฝอยและสิ่งปฏิกูล ครอบคลุมงานรักษาความสะอาด การจัดการขยะ การพัฒนาระบบจัดการมูลฝอย และการจัดการสิ่งปฏิกูลในเขตเทศบาลนครนนทบุรี",
  keywords: [
    "ส่วนบริการอนามัยสิ่งแวดล้อม",
    "งานรักษาความสะอาด",
    "การจัดการขยะ",
    "งานลอกท่อ",
    "งานสิ่งปฏิกูล",
    "งานสุขาภิบาล",
    "เทศบาลนครนนทบุรี",
  ],
  alternates: {
    canonical: "/departments/environmental-health-services",
  },
  openGraph: {
    title: "ส่วนบริการอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "ภารกิจหลักของฝ่ายจัดการมูลฝอยและสิ่งปฏิกูล ครอบคลุมการรักษาความสะอาด การเก็บขนขยะ การบำบัดสิ่งปฏิกูล และงานสุขาภิบาลในพื้นที่เทศบาลนครนนทบุรี",
    url: "/departments/environmental-health-services",
    type: "article",
    siteName: "เว็บไซต์เทศบาลนครนนทบุรี",
    locale: "th_TH",
    images: ["/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ส่วนบริการอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "ดูแลและบริหารงานด้านการรักษาความสะอาด การจัดการขยะ และสิ่งปฏิกูลของเทศบาลนครนนทบุรี",
    images: ["/logo-nonthaburi.jpg"],
  },
};

const page = () => {
  return <EnvironmentalHealthServicesSection/>
}

export default page