import GeneralAffairsSection from "@/features/users/components/Departments/GeneralAffairsSection";

export const metadata = {
  title: "ฝ่ายบริหารงานทั่วไป | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "ฝ่ายบริหารงานทั่วไป รับผิดชอบงานสารบรรณ ธุรการ พัสดุ การเงินและบัญชี การโอนงบประมาณ การเลื่อนขั้นเงินเดือน การขอรับบำนาญ และงานอื่น ๆ ตามที่ได้รับมอบหมาย",
  keywords: [
    "ฝ่ายบริหารงานทั่วไป",
    "สำนักสาธารณสุข",
    "เทศบาลนครนนทบุรี",
    "งานธุรการ",
    "งานการเงิน",
    "งานบัญชี",
    "งานพัสดุ",
    "งานสารบรรณ",
    "ราชการส่วนท้องถิ่น",
    "ข้อมูลหน่วยงาน",
  ],
  alternates: {
    canonical: "/departments/general-affairs",
  },
  openGraph: {
    title: "ฝ่ายบริหารงานทั่วไป | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "ดูรายละเอียดหน้าที่ฝ่ายบริหารงานทั่วไป เช่น งานสารบรรณ การเงิน บัญชี พัสดุ และงานอื่น ๆ ภายในสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    url: "/departments/general-affairs",
    siteName: "เทศบาลนครนนทบุรี",
    locale: "th_TH",
    type: "article",
    images: [
      "/logo-nonthaburi.jpg",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ฝ่ายบริหารงานทั่วไป | สำนักสาธารณสุขและสิ่งแวดล้อม",
    description:
      "หน้าที่ฝ่ายบริหารงานทั่วไป ครอบคลุมงานธุรการ การเงิน พัสดุ บัญชี การบำเหน็จบำนาญ และงานสารบรรณ",
    images: [
      "/logo-nonthaburi.jpg",
    ],
  },
};

const page = () => {
  return <GeneralAffairsSection/>
}

export default page