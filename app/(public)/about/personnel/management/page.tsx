import ManagementSection from "@/features/users/components/Management/ManagementSection";

export const metadata = {
  title: "บุคลากรผู้บริหาร | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "รายชื่อและข้อมูลบุคลากรผู้บริหารของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี ที่รับผิดชอบงานด้านสุขภาพและสิ่งแวดล้อมของประชาชน",
  alternates: {
    canonical: "/about/personnel/management",
  },
  keywords: [
    "บุคลากร",
    "ผู้บริหาร",
    "เทศบาล",
    "สาธารณสุข",
    "เทศบาลนครนนทบุรี",
    "ฝ่ายบริหาร",
  ],
  openGraph: {
    title: "บุคลากรผู้บริหาร | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "ทำความรู้จักกับผู้บริหารของสำนักสาธารณสุขที่ดูแลการส่งเสริมสุขภาพและพัฒนาคุณภาพชีวิตของประชาชนในเขตเทศบาล",
    url: "/about/personnel/management",
    images: [
      {
        url: `/logo-nonthaburi.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    siteName: "เทศบาลนครนนทบุรี",
    type: "profile",
    locale: "th_TH",
  },
  twitter: {
    card: "summary",
    title: "บุคลากรผู้บริหาร | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "แสดงรายชื่อบุคลากรผู้บริหารของเทศบาลนครนนทบุรีและหน้าที่ความรับผิดชอบ",
    images: [`/logo-nonthaburi.jpg`],
  },
};

const page = () => {
  return <ManagementSection />
}

export default page