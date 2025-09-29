import FlowChart from "@/features/users/components/Structure/FlowChart";
export const metadata = {
  title: "โครงสร้างหน่วยงาน | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "ข้อมูลโครงสร้างการบริหารงานของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี เพื่อความเข้าใจในหน้าที่และความรับผิดชอบของแต่ละส่วนงาน",
  keywords: [
    "โครงสร้างองค์กร",
    "สำนักสาธารณสุขและสิ่งแวดล้อม",
    "เทศบาลนครนนทบุรี",
    "หน่วยงาน",
    "แผนผัง",
    "ฝ่ายบริหาร",
    "ส่วนราชการ"
  ],
  alternates: {
    canonical: `/about/structure`,
  },
  openGraph: {
    title: "โครงสร้างหน่วยงาน | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "ชมภาพรวมโครงสร้างการบริหารภายในของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี เพื่อให้ประชาชนเข้าใจบทบาทหน้าที่ของแต่ละฝ่าย",
    url: `/about/structure`,
    images: [
      {
        url: `/logo-nonthaburi.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
    locale: "th_TH",
    siteName: "เทศบาลนครนนทบุรี",
  },
  twitter: {
    card: "summary_large_image",
    title: "โครงสร้างหน่วยงาน | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "ดูโครงสร้างและหน้าที่ของแต่ละหน่วยงานในเทศบาล เพื่อความโปร่งใสและเข้าถึงง่าย",
    images: [`/logo-nonthaburi.jpg`],
  },
};

const page = () => {
  return (
    <FlowChart />
  );
};

export default page;