import EnvironmentalHealthPromotionSection from "@/features/users/components/Departments/EnvironmentalHealthPromotionSection";

export const metadata = {
  title: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "ภารกิจด้านสุขาภิบาล คุ้มครองผู้บริโภค เฝ้าระวังคุณภาพสิ่งแวดล้อม และการจัดการทรัพยากรธรรมชาติในเขตเทศบาลนครนนทบุรี รวมถึงการควบคุมร้านอาหาร ตลาดสด โรงงาน และแหล่งมลพิษต่าง ๆ",
  keywords: [
    "สุขาภิบาล",
    "สิ่งแวดล้อม",
    "คุ้มครองผู้บริโภค",
    "ตรวจสอบคุณภาพน้ำ",
    "เหตุรำคาญ",
    "มลพิษ",
    "ทรัพยากรธรรมชาติ",
    "เทศบาลนครนนทบุรี",
  ],
  alternates: {
    canonical: "/departments/environmental-health-promotion",
  },
  openGraph: {
    title: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "ดำเนินงานควบคุมสุขาภิบาล ตรวจสอบมลพิษ คุ้มครองผู้บริโภค และอนุรักษ์ทรัพยากรธรรมชาติในเขตเทศบาลนครนนทบุรี",
    url: "/departments/environmental-health-promotion",
    type: "article",
    siteName: "เว็บไซต์เทศบาลนครนนทบุรี",
    locale: "th_TH",
    images: ["/logo-nonthaburi.jpg"], 
  },
  twitter: {
    card: "summary_large_image",
    title: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "ข้อมูลด้านการควบคุมสุขาภิบาล เหตุรำคาญ มลพิษ และการอนุรักษ์สิ่งแวดล้อมในเขตเทศบาลนครนนทบุรี",
    images: ["/logo-nonthaburi.jpg"],
  },
};

const page = () => {
  return <EnvironmentalHealthPromotionSection/>
}

export default page