// src/lib/departments.ts
export type DeptKey =
  | "generalAffairs"
  | "publicHealthPromotion"
  | "environmentalHealthServices"
  | "environmentalHealthPromotion";

type LinkItem = { label: string; href: string };
type DownloadItem = { name: string; href: string; size?: string; updatedAt?: string };
type Contact = { name: string; role?: string; phone?: string; email?: string };

export type DepartmentConfig = {
  key: DeptKey;
  slug: string;
  title: string;        // ชื่อหน้า
  subtitle?: string;    // คำอธิบายสั้น
  hero: {
    image?: string;     // /images/dep-*.jpg (ถ้าไม่มีจะใช้พื้นหลัง gradient)
    badge?: string;     // ป้าย เช่น “หน่วยงานภายใน”
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    openGraphImage?: string;
  };
  kpis?: { label: string; value: string }[];   // ตัวเลขสรุปไว ๆ
  missions: string[];                          // ภารกิจ/หน้าที่
  services: { title: string; desc?: string; link?: string }[]; // บริการ/งานเด่น
  highlights?: LinkItem[];                     // ข่าว/กิจกรรมเด่น
  downloads?: DownloadItem[];                  // แบบฟอร์ม/ระเบียบ/คู่มือ
  faqs?: { q: string; a: string }[];
  contacts?: Contact[];
};

export const departments: Record<DeptKey, DepartmentConfig> = {
  generalAffairs: {
    key: "generalAffairs",
    slug: "general-affairs",
    title: "ฝ่ายบริหารงานทั่วไป",
    subtitle:
      "ดูแลงานสารบรรณ ธุรการ พัสดุ การเงิน-บัญชี งบประมาณ และงานสนับสนุนภายในทั้งหมด",
    hero: { image: "/images/dep-general.jpg", badge: "หน่วยงานภายใน" },
    seo: {
      title:
        "ฝ่ายบริหารงานทั่วไป | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
      description:
        "รับผิดชอบงานสารบรรณ ธุรการ พัสดุ การเงิน-บัญชี การโอนงบประมาณ เลื่อนขั้นเงินเดือน บำเหน็จบำนาญ และงานสนับสนุน",
      keywords: [
        "ฝ่ายบริหารงานทั่วไป",
        "สารบรรณ",
        "การเงิน",
        "บัญชี",
        "พัสดุ",
        "เทศบาลนครนนทบุรี",
      ],
      openGraphImage: "/logo-nonthaburi.jpg",
    },
    kpis: [
      { label: "หนังสือเวียน/เดือน", value: "120+" },
      { label: "คำขออนุมัติ/สัปดาห์", value: "40–60" },
      { label: "เวลาตอบรับเฉลี่ย", value: "ภายใน 1 วันทำการ" },
    ],
    missions: [
      "งานสารบรรณรับ-ส่งหนังสือ และจัดเก็บเอกสารอิเล็กทรอนิกส์",
      "งานการเงิน บัญชี งบประมาณ และการจัดสรรโอนเปลี่ยนแปลง",
      "งานพัสดุ จัดซื้อจัดจ้าง และควบคุมครุภัณฑ์",
      "งานบุคคล เลื่อนขั้นเงินเดือน บำเหน็จบำนาญ",
    ],
    services: [
      { title: "ขอเลขหนังสือ/รับ-ส่งเอกสาร", link: "/e-docs" },
      { title: "คำขอเบิก-จ่าย/งบประมาณ", link: "/finance/forms" },
      { title: "คำของานพัสดุ", link: "/procurement/requests" },
      { title: "แบบฟอร์ม HR", link: "/hr/forms" },
    ],
    highlights: [
      { label: "ประกาศแนวทางเวียนหนังสืออิเล็กทรอนิกส์ ฉบับใหม่", href: "/news/edoc-guideline-2025" },
      { label: "กำหนดส่งคำของบประมาณกลางปี งบ 2569", href: "/announcements/midyear-budget-2569" },
      { label: "คู่มือพัสดุ: ขั้นตอนจัดซื้อจัดจ้างแบบย่อ", href: "/documents/procurement-quickstart" },
    ],
    downloads: [
      { name: "คู่มือสารบรรณอิเล็กทรอนิกส์ (PDF)", href: "/files/edoc-guide.pdf", size: "3.2 MB" },
      { name: "แบบฟอร์มเบิกจ่าย", href: "/files/form-payment.docx", size: "120 KB" },
    ],
    faqs: [
      { q: "ยื่นเอกสารภายในควรแนบอะไรบ้าง?", a: "เอกสารคำขอ + สำเนาที่เกี่ยวข้อง + ช่องทางติดต่อกลับที่ชัดเจน" },
      { q: "ใช้เวลาตรวจสอบนานเท่าไร?", a: "ปกติภายใน 1 วันทำการ หากเอกสารครบถ้วน" },
    ],
    contacts: [
      { name: "งานบริหารทั่วไป", phone: "0-2589-0500 ต่อ 1223", email: "env.health.nakornnont@gmail.com" },
      { name: "งานการเงินและบัญชี", phone: "0-2589-0500 ต่อ 1225" },
    ],
  },

  publicHealthPromotion: {
    key: "publicHealthPromotion",
    slug: "public-health-promotion",
    title: "ส่วนส่งเสริมสาธารณสุข",
    subtitle:
      "ขับเคลื่อนนโยบายสุขภาพ งาน อสม. สุขศึกษา ผู้สูงอายุ และการประเมินผลสุขภาพชุมชน",
    hero: { image: "/images/dep-php.jpg", badge: "สุขภาพชุมชน" },
    seo: {
      title:
        "ส่วนส่งเสริมสาธารณสุข | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
      description:
        "ภารกิจส่งเสริมสุขภาพ งานอสม. ติดตามแผนสุขภาพ งานสุขศึกษาชุมชน และคุณภาพชีวิตผู้สูงอายุ",
      keywords: [
        "ส่วนส่งเสริมสาธารณสุข",
        "อสม.",
        "สุขภาพชุมชน",
        "สุขศึกษา",
        "ผู้สูงอายุ",
        "เทศบาลนครนนทบุรี",
      ],
      openGraphImage: "/logo-nonthaburi.jpg",
    },
    kpis: [
      { label: "เครือข่าย อสม.", value: "450+" },
      { label: "กิจกรรมสุขศึกษา/เดือน", value: "15–25" },
      { label: "ครอบคลุมวัคซีนเด็ก", value: "≥ 95%" },
    ],
    missions: [
      "พัฒนาและติดตามนโยบาย/แผนสุขภาพระดับพื้นที่",
      "เสริมศักยภาพเครือข่าย อสม. และภาคีสุขภาพ",
      "สุขศึกษาและรณรงค์เชิงรุกในชุมชน โรงเรียน ตลาด",
      "โครงการผู้สูงอายุและกลุ่มเปราะบาง",
    ],
    services: [
      { title: "นัดหมายกิจกรรมสุขภาพ", link: "/health-events" },
      { title: "ลงทะเบียน อสม. ใหม่", link: "/village-health-volunteer" },
      { title: "สื่อสุขศึกษา", link: "/edu-media" },
    ],
    highlights: [
      { label: "เปิดรับข้อเสนอโครงการกองทุนสุขภาพท้องถิ่น (รอบ 1/2569)", href: "/healthfund/calls/1-2569" },
      { label: "อบรม อสม. ชุดทักษะดูแลผู้สูงอายุที่บ้าน", href: "/activities/vhv-elderly-homecare" },
      { label: "สื่อสุขศึกษา: ชุดโภชนาการวัยเรียน ดาวน์โหลด", href: "/edu-media/nutrition-school-pack" },
      { label: "คลินิกสัตวแพทย์ เทศบาล — ตารางบริการเดือนนี้", href: "/vet-clinic/schedule" },
    ],
    downloads: [
      { name: "ชุดความรู้สุขศึกษา (ZIP)", href: "/files/edu-pack.zip", size: "12 MB" },
    ],
    faqs: [
      { q: "สมัครเป็น อสม. ต้องทำอย่างไร?", a: "กรอกแบบฟอร์มออนไลน์และรอการติดต่อจากเจ้าหน้าที่เพื่อนัดสัมภาษณ์" },
    ],
    contacts: [
      { name: "งานส่งเสริมสุขภาพ", phone: "0-2589-0500 ต่อ 1214", email: "env.health.nakornnont@gmail.com" },
      { name: "งานวิชาการ", phone: "0-2589-0500 ต่อ 1218", email: "env.health.nakornnont@gmail.com" },
    ],
  },

  environmentalHealthServices: {
    key: "environmentalHealthServices",
    slug: "environmental-health-services",
    title: "ส่วนบริการอนามัยสิ่งแวดล้อม",
    subtitle:
      "ดูแลความสะอาด เมืองน่าอยู่ จัดการมูลฝอย สิ่งปฏิกูล และระบบสุขาภิบาลพื้นที่",
    hero: { image: "/images/dep-ehs.jpg", badge: "ปฏิบัติการภาคสนาม" },
    seo: {
      title:
        "ส่วนบริการอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
      description:
        "ภารกิจรักษาความสะอาด เก็บขนขยะ บำบัดสิ่งปฏิกูล ลอกท่อ และงานสุขาภิบาลพื้นที่",
      keywords: [
        "อนามัยสิ่งแวดล้อม",
        "จัดการขยะ",
        "สิ่งปฏิกูล",
        "ลอกท่อ",
        "ความสะอาดเมือง",
        "เทศบาลนครนนทบุรี",
      ],
      openGraphImage: "/logo-nonthaburi.jpg",
    },
    kpis: [
      { label: "จุดรับขยะ/วัน", value: "2,000+" },
      { label: "ร้องเรียนปิดงาน/เดือน", value: "95% ภายใน 48 ชม." },
      { label: "สิ่งปฏิกูลกำจัด", value: "100% ตามมาตรฐาน" },
    ],
    missions: [
      "จัดเก็บและขนส่งมูลฝอยตามเส้นทาง/ตาราง",
      "งานลอกท่อ คู คลอง และกำจัดวัชพืช",
      "บริการดูดสิ่งปฏิกูลถูกสุขลักษณะ",
      "ตรวจสุขาภิบาลพื้นที่ตลาด/ชุมชน",
    ],
    services: [
      { title: "แจ้งขยะตกค้าง", link: "/e-service/waste-report" },
      { title: "ขอรถดูดส้วม", link: "/e-service/septic" },
      { title: "ตรวจสอบเส้นทางรถขยะ", link: "/maps/waste-route" },
    ],
    highlights: [
      { label: "ประกาศตารางเก็บขยะเขตเมืองชั้นใน (อัปเดต)", href: "/waste/schedule-inner-zone" },
      { label: "แผนลอกท่อ/คูคลอง ไตรมาส 1", href: "/env/maintenance/q1-plan" },
      { label: "รายงานผลการเก็บขนสิ่งปฏิกูลประจำเดือน", href: "/reports/septic-ops-monthly" },
      { label: "แคมเปญคัดแยกขยะครัวเรือน: ชุดสื่อพร้อมใช้", href: "/campaigns/household-sorting-kit" },
    ],
    downloads: [
      { name: "ตารางเก็บขยะ (PDF)", href: "/files/waste-schedule.pdf" },
      { name: "คู่มือการคัดแยกขยะ", href: "/files/waste-guide.pdf" },
    ],
    faqs: [
      { q: "วันเวลาเก็บขยะหน้าบ้านคือเมื่อไร?", a: "ตรวจสอบจากตารางเก็บขยะหรือแผนที่เส้นทางบนเว็บไซต์" },
    ],
    contacts: [
      { name: "งานจัดการมูลฝอย", phone: "0-2589-0500 ต่อ 1202", email: "env.health.nakornnont@gmail.com" },
      { name: "งานบริการสูบสิ่งปฏิกูล", phone: "0-2589-0500 ต่อ 1203", email: "env.health.nakornnont@gmail.com" },
    ],
  },

  environmentalHealthPromotion: {
    key: "environmentalHealthPromotion",
    slug: "environmental-health-promotion",
    title: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม",
    subtitle:
      "กำกับดูแลสุขาภิบาล คุ้มครองผู้บริโภค เฝ้าระวังมลพิษ และจัดการทรัพยากรธรรมชาติ",
    hero: { image: "/images/dep-ehp.jpg", badge: "กำกับมาตรฐาน" },
    seo: {
      title:
        "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
      description:
        "ควบคุมร้านอาหาร ตลาด แหล่งกำเนิดมลพิษ ตรวจคุณภาพน้ำ-อากาศ และเหตุรำคาญ",
      keywords: [
        "สุขาภิบาล",
        "คุ้มครองผู้บริโภค",
        "มลพิษ",
        "เหตุรำคาญ",
        "คุณภาพน้ำ",
        "เทศบาลนครนนทบุรี",
      ],
      openGraphImage: "/logo-nonthaburi.jpg",
    },
    kpis: [
      { label: "สถานประกอบการกำกับ", value: "1,200+" },
      { label: "การตรวจติดตาม/เดือน", value: "100–150" },
      { label: "ข้อร้องเรียนปิดผล", value: "≥ 90%" },
    ],
    missions: [
      "ตรวจสุขาภิบาลร้านอาหาร ตลาด โรงงาน",
      "เฝ้าระวังคุณภาพน้ำ อากาศ เสียง และเหตุรำคาญ",
      "คุ้มครองผู้บริโภคด้านอาหารและบริการ",
      "บังคับใช้กฎหมายและมาตรการสิ่งแวดล้อม",
    ],
    services: [
      { title: "ขอใบอนุญาต/ต่ออายุ", link: "/license" },
      { title: "ร้องเรียนเหตุรำคาญ", link: "/complaints/nuisance" },
      { title: "ขอตรวจคุณภาพน้ำ", link: "/env/water-test" },
    ],
    highlights: [
      { label: "ตรวจสุขาภิบาลตลาดสด—สรุปผลและข้อเสนอแนะ", href: "/inspections/market-hygiene-report" },
      { label: "ขยายเวลาต่อใบอนุญาตกิจการอาหารปี 2569", href: "/license/food-2026-extension" },
      { label: "แจ้งเตือนคุณภาพอากาศช่วงฤดูฝุ่น—มาตรการป้องกัน", href: "/env-monitoring/pm-warning" },
      { label: "คู่มือสิทธิผู้บริโภคฉบับย่อ ดาวน์โหลด", href: "/consumer-protection/handbook-short" },
    ],
    downloads: [
      { name: "คู่มือผู้ประกอบการอาหารสะอาด", href: "/files/sanitation-guide.pdf" },
    ],
    faqs: [
      { q: "เปิดร้านอาหารต้องขออนุญาตอะไร?", a: "ยื่นคำขอใบอนุญาตประกอบกิจการตาม พ.ร.บ. สาธารณสุข พร้อมหลักฐานที่กำหนด" },
    ],
    contacts: [
      { name: "งานสุขาภิบาลและคุ้มครองผู้บริโภค", phone: "0-2589-0500 ต่อ 1207", email: "sanitation@example.go.th" },
      { name: "งานทรัพยากรธรรมชาติ", phone: "0-2589-0500 ต่อ 1210", email: "sanitation@example.go.th" },
    ],
  },
};

export function getDepartmentBySlug(slug: string) {
  const item = Object.values(departments).find((d) => d.slug === slug);
  return item ?? null;
}
