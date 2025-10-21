import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { Building2, ShieldCheck, Recycle, Stethoscope, Users2, MapPin, } from "lucide-react";
import FaqCard from "@/components/Roles/FaqCard";
import DownloadsList from "@/components/Roles/DownloadsList";
import ProcessSteps from "@/components/Roles/ProcessSteps";
import SectionsAccordion from "@/components/Roles/SectionsAccordion";
import MandatesGrid from "@/components/Roles/MandatesGrid";
import RolesHero from "@/components/Roles/RolesHero";

export const metadata: Metadata = {
  title:
    "อำนาจหน้าที่ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "อำนาจหน้าที่และภารกิจหลักของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  alternates: { canonical: "/about/roles" },
  keywords: [
    "อำนาจหน้าที่",
    "สำนักสาธารณสุขและสิ่งแวดล้อม",
    "เทศบาลนครนนทบุรี",
    "หน่วยงานราชการ",
  ],
  openGraph: {
    title:
      "อำนาจหน้าที่ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description: "ดูรายละเอียดอำนาจหน้าที่และภารกิจของหน่วยงาน",
    url: "/about/roles",
    images: ["/logo-nonthaburi.jpg"],
    siteName: "เทศบาลนครนนทบุรี",
    type: "article",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "อำนาจหน้าที่ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "แสดงอำนาจหน้าที่ของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    images: ["/logo-nonthaburi.jpg"],
  },
};

// ------- Content model (mock) -------
const mandates = [
  {
    icon: Stethoscope,
    title: "ส่งเสริมสุขภาพและป้องกันโรค",
    desc: "ยกระดับสุขภาพประชาชนแบบรอบด้าน พัฒนาองค์ความรู้ ชุดความรู้สุขภาพ และสนับสนุนกิจกรรมชุมชนปลอดโรค.",
  },
  {
    icon: Recycle,
    title: "จัดการมูลฝอยและสิ่งปฏิกูล",
    desc: "ยกระดับระบบเก็บขน แยกขยะต้นทาง กำกับการกำจัดอย่างถูกสุขลักษณะ ลดผลกระทบสิ่งแวดล้อม.",
  },
  {
    icon: ShieldCheck,
    title: "กำกับคุณภาพสิ่งแวดล้อม",
    desc: "ติดตามคุณภาพน้ำ อากาศ เสียง กลิ่น และปัจจัยเสี่ยง พร้อมมาตรการเฝ้าระวังและตอบโต้เหตุ.",
  },
  {
    icon: Users2,
    title: "มีส่วนร่วมกับชุมชน",
    desc: "สร้างเครือข่าย อสม./ภาคีสุขภาพ ร่วมออกแบบนโยบายท้องถิ่นและกิจกรรมสุขภาวะ.",
  },
  {
    icon: Building2,
    title: "บริหารจัดการองค์กร",
    desc: "วางแผนงบประมาณ บุคลากร จัดทำระเบียบ/มาตรฐานงาน และบริหารความเสี่ยงองค์กร.",
  },
  {
    icon: MapPin,
    title: "บริการเชิงพื้นที่",
    desc: "ให้บริการลงพื้นที่ ตรวจสถานประกอบการ เขตงานรักษาความสะอาด และบริการเชิงรุก.",
  },
];

const sections = [
  {
    key: "general",
    title: "ฝ่ายบริหารงานทั่วไป",
    body: "กำหนดนโยบาย อำนวยการ ติดตามผล และสนับสนุนงานการเงิน บริหารบุคคล พัสดุ และอำนวยความสะดวกการบริการประชาชน.",
    href: "/departments/general-affairs",
  },
  {
    key: "php",
    title: "ส่วนส่งเสริมสาธารณสุข",
    body: "กำกับงานวิชาการ/ประเมินผล งานส่งเสริมสุขภาพ อนามัยแม่และเด็ก ผู้สูงอายุ ผู้พิการ และการสื่อสารความเสี่ยง.",
    href: "/departments/public-health-promotion",
  },
  {
    key: "ehs",
    title: "ส่วนบริการอนามัยสิ่งแวดล้อม",
    body: "มุ่งงานจัดการมูลฝอย สิ่งปฏิกูล ควบคุมพาหะนำโรค การสุขาภิบาลอาหารและสถานที่สาธารณะ.",
    href: "/departments/environmental-health-services",
  },
  {
    key: "ehp",
    title: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม",
    body: "พัฒนาระบบควบคุมมลพิษ ชุดมาตรการลดผลกระทบสิ่งแวดล้อม และการมีส่วนร่วมด้านสิ่งแวดล้อมชุมชน.",
    href: "/departments/environmental-health-promotion",
  },
];

const faq = [
  {
    q: "อำนาจหน้าที่หลักต่างจากภารกิจอย่างไร?",
    a: "อำนาจหน้าที่คือกรอบตามกฎหมาย/ระเบียบ ส่วนภารกิจคือสิ่งที่หน่วยงานทำให้เกิดผลจริงในพื้นที่ เช่น โครงการ/บริการ/กิจกรรม.",
  },
  {
    q: "มีช่องทางร้องเรียนสิ่งแวดล้อมไหม?",
    a: "มีศูนย์รับเรื่องออนไลน์ในหน้า E‑Service และสายด่วนเทศบาล โดยระบบจะออกหมายเลขติดตามผลให้.",
  },
  {
    q: "ข้อมูลนี้อัปเดตบ่อยแค่ไหน?",
    a: "เราทบทวนทุกไตรมาส และปรับคำอธิบายเมื่อกฎหมาย/มาตรฐานมีการเปลี่ยนแปลง.",
  },
];

const downloads = [
  { name: "ระเบียบ/ข้อบัญญัติท้องถิ่นด้านสาธารณสุขและสิ่งแวดล้อม (ฉบับล่าสุด)", href: "", size: "3.2 MB", updatedAt: "1 มิ.ย. 2567" },
  { name: "คู่มือประชาชนสำหรับบริการหลัก (E‑Service)", href: "", size: "120 KB", updatedAt: "1 มิ.ย. 2567" },
  { name: "ผังโครงสร้างหน่วยงาน (Organization Chart)", href: "", size: "120 KB", updatedAt: "1 มิ.ย. 2567" },
]

const process = [
  { step: "รับเรื่อง/ประเมิน", detail: "รับเรื่องร้องเรียน/ข้อเสนอแนะ จัดลำดับความเร่งด่วน และกำหนด SLA" },
  { step: "ดำเนินการ/ประสาน", detail: "มอบหมายพื้นที่/หน่วยรับผิด ตรวจสอบภาคสนาม และบันทึกผลบนระบบ" },
  { step: "สรุปผล/สื่อสาร", detail: "สรุปผล ติดตามความพึงพอใจ และเผยแพร่ข้อมูลที่เปิดเผยได้" },
]

const d = {
  title: "อำนาจหน้าที่ของสำนักสาธารณสุขและสิ่งแวดล้อม",
  subtitle: "กรอบบทบาท ภารกิจหลัก และขอบเขตงานที่เรารับผิดชอบ เพื่อคุณภาพชีวิตที่ดีของประชาชนและสิ่งแวดล้อมเมืองนนท์",
  hero: { badge: "ข้อมูลหน่วยงาน", },
  downloads: [
    { name: "ระเบียบ/ข้อบัญญัติ", href: "", size: "3.2 MB", updatedAt: "1 มิ.ย. 2567" },
    { name: "คู่มือประชาชน", href: "", size: "120 KB", updatedAt: "1 มิ.ย. 2567" },
    { name: "แผนผังองค์กร", href: "", size: "120 KB", updatedAt: "1 มิ.ย. 2567" },
  ],
  kpis: [
    { label: "ความพึงพอใจบริการ", value: "92%", hint: "สำรวจประจำปี" },
    { label: "ครัวเรือนคัดแยกขยะ", value: "68%", hint: "อัปเดตรายไตรมาส" },
    { label: "เหตุร้องเรียนแก้ไขภายใน 48 ชม.", value: "95%", hint: "เฉลี่ยรายเดือน" },
  ],
};

export default function RolesPage() {
  return (
    <main className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <nav aria-label="Breadcrumb" className="mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">หน้าแรก</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>อำนาจหน้าที่</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      <RolesHero d={d} />
      <MandatesGrid items={mandates} />
      <SectionsAccordion items={sections} />
      <ProcessSteps items={process} />
      <DownloadsList items={downloads} />
      <FaqCard items={faq} />
    </main>
  );
}