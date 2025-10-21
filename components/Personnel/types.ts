export type Personnel = {
    id: string | number;
    nameTitle?: string | null;
    firstName: string;
    lastName: string;
    position?: string | null;
    positionName?: string | null;
    image?: string | null;
    email?: string | null;
    phone?: string | null;
    departmentName?: string | null;
    divisionName?: string | null;
    bio?: string | null;
};

export type Mgmt = Personnel & {
  level: 1 | 2 | 3;
  fullName: string;
  imageResolved: string;
  departmentLabel?: string | null;
};

export const mockPersonnel: Personnel[] = [
    // ── ผู้อำนวยการสำนัก (1)
    {
        id: 1,
        nameTitle: "นาง",
        firstName: "ชลธิชา",
        lastName: "วรนิล",
        positionName: "ผู้อำนวยการสำนักสาธารณสุขและสิ่งแวดล้อม",
        email: "chonticha@nonthaburi.go.th",
        phone: "02-123-4567",
        departmentName: "สำนักสาธารณสุขและสิ่งแวดล้อม",
        bio: "ขับเคลื่อนนโยบายสาธารณสุขเชิงรุก เน้นความเสมอภาคและข้อมูลเชิงหลักฐาน"
    },

    // ── ผู้อำนวยการส่วน (3)
    {
        id: 2,
        nameTitle: "นาย",
        firstName: "ภาสกร",
        lastName: "นาคะไพศาล",
        positionName: "ผู้อำนวยการส่วนส่งเสริมสุขภาพ",
        email: "phatsakorn@nonthaburi.go.th",
        phone: "089-111-2200",
        departmentName: "ส่วนส่งเสริมสุขภาพ",
        bio: "เชี่ยวชาญการออกแบบโครงการส่งเสริมกิจกรรมทางกายและโภชนาการ"
    },
    {
        id: 3,
        nameTitle: "นางสาว",
        firstName: "กมลชนก",
        lastName: "อินทรศรี",
        positionName: "ผู้อำนวยการส่วนบริการอนามัยสิ่งแวดล้อม",
        email: "kamonchanok@nonthaburi.go.th",
        phone: "081-555-3344",
        departmentName: "ส่วนอนามัยสิ่งแวดล้อม",
        bio: "โฟกัสระบบตรวจติดตามคุณภาพสิ่งแวดล้อมและการสื่อสารความเสี่ยง"
    },
    {
        id: 4,
        nameTitle: "นาย",
        firstName: "วสันต์",
        lastName: "สิงหนาท",
        positionName: "ผู้อำนวยการส่วนบริหารทั่วไป",
        email: "wasan@nonthaburi.go.th",
        phone: "02-999-8888",
        departmentName: "ส่วนบริหารทั่วไป",
        bio: "ดูแลงบประมาณ พัสดุ และบุคลากร เน้นโปร่งใสและวัดผลได้"
    },

    // ── หัวหน้าฝ่าย (4)
    {
        id: 5,
        nameTitle: "นาย",
        firstName: "นันทภพ",
        lastName: "จิตติคุณ",
        position: "หัวหน้าฝ่ายส่งเสริมสุขภาพชุมชน", // ใช้ position ก็จับ level ได้
        email: "nantaphop@nonthaburi.go.th",
        phone: "086-700-1122",
        divisionName: "ฝ่ายส่งเสริมสุขภาพชุมชน",
        bio: "ขับเคลื่อนเครือข่าย อสม. และกิจกรรมชุมชนปลอดบุหรี่"
    },
    {
        id: 6,
        nameTitle: "นาง",
        firstName: "ปริมประภา",
        lastName: "สุวรรณชาติ",
        position: "หัวหน้าฝ่ายอนามัยสิ่งแวดล้อม",
        email: null, // ทดสอบไม่มีอีเมล
        phone: "095-333-7788",
        divisionName: "ฝ่ายอนามัยสิ่งแวดล้อม",
        bio: "เชี่ยวชาญมาตรฐานสถานประกอบการปลอดภัยและระบบร้องเรียนสิ่งแวดล้อม"
    },
    {
        id: 7,
        nameTitle: "นาย",
        firstName: "อธิวัฒน์",
        lastName: "เมธาวงศ์",
        position: "หัวหน้าฝ่ายจัดการขยะและรีไซเคิล",
        email: "athiwat@nonthaburi.go.th",
        phone: null, // ทดสอบไม่มีเบอร์
        divisionName: "ฝ่ายจัดการขยะ",
        bio: "ผลักดัน Zero Waste และระบบคัดแยกขยะต้นทางในชุมชน"
    },
    {
        id: 8,
        nameTitle: "นางสาว",
        firstName: "มณีรัตน์",
        lastName: "เพ็ชร์สกุล",
        position: "หัวหน้าฝ่ายระบาดวิทยาและเฝ้าระวังโรค",
        email: "maneerat@nonthaburi.go.th",
        phone: "082-444-9911",
        divisionName: "ฝ่ายระบาดวิทยา",
        bio: "วิเคราะห์ข้อมูลระบาดวิทยาแบบ near-real-time เชื่อมโยงข้อมูลหลายแหล่ง"
    }
];