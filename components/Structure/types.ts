import type { OrgUnit } from "@/components/Structure/OrgTree";
import type { Leader } from "@/components/Structure/LeadershipGrid";

export const leaders: Leader[] = [
    { id: "1", name: "นพ. สมชาย ใจดี", role: "ผู้อำนวยการ", email: "director@non.go.th", phone: "02-589-0500 ต่อ 1220", photo: "/person_picture.png" },
    { id: "2", name: "นาง สายใจ สุขภาพ", role: "รองผู้อำนวยการ", unit: "งานบริการอนามัยสิ่งแวดล้อม", email: "deputy@non.go.th" },
    { id: "3", name: "นาย ปรีชา รักษ์เมือง", role: "รักษาราชการแทนผู้อำนวยการส่วนบริการอนามัยสิ่งแวดล้อม", unit: "ฝ่ายบริหารทั่วไป", phone: "02-123-0000" },
];

export const orgUnits: OrgUnit[] = [
    {
        key: "phe-root",
        name: "สำนักสาธารณสุขและสิ่งแวดล้อม",
        description: "กำกับดูแลภารกิจด้านสาธารณสุข อนามัยสิ่งแวดล้อม สุขาภิบาล และงานบริหาร",
        badge: "หน่วยงานหลัก",
        tags: ["สาธารณสุข", "สิ่งแวดล้อม", "สุขาภิบาล"],
        children: [
            {
                key: "public-health-section",
                name: "ส่วนส่งเสริมสาธารณสุข",
                description: "ขับเคลื่อนเชิงวิชาการและการส่งเสริมสุขภาพในชุมชน",
                children: [
                    {
                        key: "academic-evaluation-division",
                        name: "ฝ่ายวิชาการและการประเมินผล",
                        description: "วางแผน เชื่อมข้อมูล ติดตามประเมินผล",
                        children: [
                            { key: "policy-planning", name: "งานนโยบายและแผนงานสาธารณสุข", description: "กำหนดนโยบาย แผนงาน/โครงการ และตัวชี้วัด" },
                            { key: "academic-info", name: "งานวิชาการและบริการข้อมูล", description: "จัดทำองค์ความรู้ บริการข้อมูลและสารสนเทศสุขภาพ" },
                            { key: "monitoring-eval", name: "งานติดตามและประเมินผล", description: "ติดตามผลลัพธ์ ประเมินประสิทธิผลโครงการ" },
                        ],
                    },
                    {
                        key: "health-promotion-division",
                        name: "ฝ่ายส่งเสริมสาธารณสุข",
                        description: "ดำเนินงานส่งเสริม ป้องกัน และพัฒนาคุณภาพชีวิต",
                        children: [
                            { key: "uhc", name: "งานหลักประกันสุขภาพ", description: "บริหารกองทุน/สิทธิประโยชน์และเครือข่ายบริการ" },
                            { key: "elderly-qol", name: "งานส่งเสริมคุณภาพชีวิตผู้สูงอายุ", description: "กิจกรรมผู้สูงอายุและเครือข่ายดูแลระยะยาว" },
                            { key: "vhv", name: "งานอาสาสมัครสาธารณสุข", description: "พัฒนา สนับสนุน และสื่อสารเครือข่าย อสม." },
                            { key: "training-comms", name: "งานเผยแพร่และฝึกอบรมด้านสาธารณสุข", description: "สื่อสารความเสี่ยง อบรม/ถ่ายทอดความรู้" },
                            { key: "veterinary", name: "งานสัตวแพทย์", description: "เฝ้าระวังโรคสัตว์ พิษสุนัขบ้า และสวัสดิภาพสัตว์" },
                            { key: "health-promo", name: "งานส่งเสริมสุขภาพ", description: "โภชนาการ กิจกรรมทางกาย NCD วัคซีน" },
                            { key: "disease-control", name: "งานป้องกันและควบคุมโรค", description: "เฝ้าระวัง ป้องกัน และควบคุมโรคในชุมชน" },
                        ],
                    },
                ],
            },
            {
                key: "env-services-section",
                name: "ส่วนบริการอนามัยสิ่งแวดล้อม",
                description: "บริการจัดการขยะ สิ่งปฏิกูล และความสะอาดเมือง",
                children: [
                    {
                        key: "solid-waste-division",
                        name: "ฝ่ายจัดการมูลฝอยและสิ่งปฏิกูล",
                        description: "วางระบบ เก็บขน พัฒนา และกำกับมาตรฐาน",
                        children: [
                            { key: "city-cleaning", name: "งานบริการรักษาความสะอาด", description: "กวาดถนน ล้างทาง กำจัดวัชพืช/เศษวัสดุ" },
                            { key: "waste-mgmt", name: "งานบริหารจัดการมูลฝอย", description: "เส้นทาง/เวลาเก็บขน จุดทิ้ง และร้องเรียน" },
                            { key: "waste-system-dev", name: "งานพัฒนาระบบจัดการมูลฝอย", description: "แผนพัฒนา เทคโนโลยี และการมีส่วนร่วมประชาชน" },
                            { key: "faecal-mgmt", name: "งานบริหารจัดการสิ่งปฏิกูล", description: "สูบสิ่งปฏิกูล ขนถ่าย และกำกับจุดรองรับ" },
                        ],
                    },
                ],
            },
            {
                key: "env-promotion-section",
                name: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม",
                description: "กำกับสุขาภิบาล คุ้มครองผู้บริโภค และคุณภาพสิ่งแวดล้อม",
                children: [
                    {
                        key: "env-quality-division",
                        name: "ฝ่ายควบคุมและจัดการคุณภาพสิ่งแวดล้อม",
                        description: "ตรวจ ประเมิน เฝ้าระวัง และบังคับใช้กฎหมายท้องถิ่น",
                        children: [
                            { key: "ghp", name: "งานสุขาภิบาลสถานประกอบการ", description: "ร้านอาหาร ตลาด โรงงาน ตามมาตรฐาน GHP" },
                            { key: "community-sanitation", name: "งานสุขาภิบาลชุมชนเมืองและเหตุรำคาญ", description: "จัดการแหล่งก่อเหตุรำคาญและสุขาภิบาลที่อยู่อาศัย" },
                            { key: "consumer-protection", name: "งานคุ้มครองผู้บริโภค", description: "ฉลาก ราคา มาตรฐานสินค้าและบริการท้องถิ่น" },
                            { key: "env-monitoring", name: "งานเฝ้าระวังและตรวจสอบคุณภาพสิ่งแวดล้อม", description: "น้ำ อากาศ เสียง ฝุ่น และสารเคมี" },
                            { key: "natural-resources", name: "งานจัดการทรัพยากรธรรมชาติและสิ่งแวดล้อม", description: "ฟื้นฟู อนุรักษ์ และใช้ประโยชน์อย่างยั่งยืน" },
                        ],
                    },
                ],
            },
            {
                key: "general-admin-division",
                name: "ฝ่ายบริหารงานทั่วไป",
                description: "สนับสนุนงานธุรการ บุคคล พัสดุ การเงิน/บัญชี",
                children: [
                    { key: "general-admin", name: "งานบริหารทั่วไป", description: "สารบรรณ ประชาสัมพันธ์ ทรัพยากรบุคคล/พัสดุ" },
                    { key: "finance-accounting", name: "งานการเงินและบัญชี", description: "งบประมาณ เบิกจ่าย และรายงานการเงิน" },
                ],
            },
        ],
    },
];

// สำหรับมุมมองไดอะแกรมอย่างง่าย (สามารถ map จาก orgUnits จริงในอนาคต)
export const orgFlow = {
    nodes: [
        { id: "1", position: { x: 799, y: 0 }, data: { label: "สำนักสาธารณสุขและสิ่งแวดล้อม" } },
        { id: "2", position: { x: 300, y: 150 }, data: { label: "ส่วนส่งเสริมสาธารณสุข" } },
        { id: "3", position: { x: 120, y: 250 }, data: { label: "ฝ่ายวิชาการและการประเมินผล" } },
        { id: "4", position: { x: 140, y: 350 }, data: { label: "งานนโยบายและแผนงานสาธารณสุข" }, type: "CustomLeftNode" },
        { id: "5", position: { x: 140, y: 450 }, data: { label: "งานวิชาการและบริการข้อมูล" }, type: "CustomLeftNode" },
        { id: "6", position: { x: 140, y: 550 }, data: { label: "งานติดตามและประเมินผล" }, type: "CustomLeftNode" },
        { id: "7", position: { x: 450, y: 250 }, data: { label: "ฝ่ายส่งเสริมสาธารณสุข" } },
        { id: "8", position: { x: 470, y: 350 }, data: { label: "งานหลักประกันสุขภาพ" }, type: "CustomLeftNode" },
        { id: "9", position: { x: 470, y: 450 }, data: { label: "งานส่งเสริมคุณภาพชีวิตผู้สูงอายุ" }, type: "CustomLeftNode" },
        { id: "10", position: { x: 470, y: 550 }, data: { label: "งานอาสาสมัครสาธารณสุข" }, type: "CustomLeftNode" },
        { id: "11", position: { x: 470, y: 650 }, data: { label: "งานเผยแพร่และฝึกอบรมด้านสาธารณสุข" }, type: "CustomLeftNode" },
        { id: "12", position: { x: 470, y: 750 }, data: { label: "งานสัตวแพทย์" }, type: "CustomLeftNode" },
        { id: "13", position: { x: 470, y: 850 }, data: { label: "งานส่งเสริมสุขภาพ" }, type: "CustomLeftNode" },
        { id: "14", position: { x: 470, y: 950 }, data: { label: "งานป้องกันและควบคุมโรค" }, type: "CustomLeftNode" },
        { id: "15", position: { x: 810, y: 150 }, data: { label: "ส่วนบริการอนามัยสิ่งแวดล้อม" } },
        { id: "16", position: { x: 803, y: 250 }, data: { label: "ฝ่ายจัดการมูลฝอยและสิ่งปฏิกูล" } },
        { id: "17", position: { x: 820, y: 350 }, data: { label: "งานบริการรักษาความสะอาด" }, type: "CustomLeftNode" },
        { id: "18", position: { x: 820, y: 450 }, data: { label: "งานบริหารจัดการมูลฝอย" }, type: "CustomLeftNode" },
        { id: "19", position: { x: 820, y: 550 }, data: { label: "งานพัฒนาระบบจัดการมูลฝอย" }, type: "CustomLeftNode" },
        { id: "20", position: { x: 820, y: 650 }, data: { label: "งานบริหารจัดการสิ่งปฏิกูล" }, type: "CustomLeftNode" },
        { id: "21", position: { x: 1137, y: 150 }, data: { label: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม" } },
        { id: "22", position: { x: 1100, y: 250 }, data: { label: "ฝ่ายควบคุมและจัดการคุณภาพสิ่งแวดล้อม" } },
        { id: "23", position: { x: 1120, y: 350 }, data: { label: "งานสุขาภิบาลสถานประกอบการ" }, type: "CustomLeftNode" },
        { id: "24", position: { x: 1120, y: 450 }, data: { label: "งานสุขาภิบาลชุมชนเมืองและเหตุรำคาญ" }, type: "CustomLeftNode" },
        { id: "25", position: { x: 1120, y: 550 }, data: { label: "งานคุ้มครองผู้บริโภค" }, type: "CustomLeftNode" },
        { id: "26", position: { x: 1120, y: 650 }, data: { label: "งานเฝ้าระวังและตรวจสอบคุณภาพสิ่งแวดล้อม" }, type: "CustomLeftNode" },
        { id: "27", position: { x: 1120, y: 750 }, data: { label: "งานจัดการทรัพยากรธรรมชาติและสิ่งแวดล้อม" }, type: "CustomLeftNode" },
        { id: "28", position: { x: 1450, y: 61 }, data: { label: "ฝ่ายบริหารงานทั่วไป" } },
        { id: "29", position: { x: 1470, y: 150 }, data: { label: "งานบริหารทั่วไป" }, type: "CustomLeftNode" },
        { id: "30", position: { x: 1470, y: 250 }, data: { label: "งานการเงินและบัญชี" }, type: "CustomLeftNode" },
    ],
    edges: [
        { id: "e1", source: "1", target: "2", type: "step", sourceHandle: "bottom" },
        { id: "e2", source: "2", target: "3", type: "step", sourceHandle: "bottom" },
        { id: "e3", source: "3", target: "4", type: "step", sourceHandle: "left" },
        { id: "e4", source: "3", target: "5", type: "step", sourceHandle: "left" },
        { id: "e5", source: "3", target: "6", type: "step", sourceHandle: "left" },
        { id: "e6", source: "2", target: "7", type: "step", sourceHandle: "bottom" },
        { id: "e7", source: "7", target: "8", type: "step", sourceHandle: "left" },
        { id: "e8", source: "7", target: "9", type: "step", sourceHandle: "left" },
        { id: "e9", source: "7", target: "10", type: "step", sourceHandle: "left" },
        { id: "e10", source: "7", target: "11", type: "step", sourceHandle: "left" },
        { id: "e11", source: "7", target: "12", type: "step", sourceHandle: "left" },
        { id: "e13", source: "7", target: "13", type: "step", sourceHandle: "left" },
        { id: "e14", source: "7", target: "14", type: "step", sourceHandle: "left" },
        { id: "e15", source: "1", target: "15", type: "step", sourceHandle: "bottom" },
        { id: "e16", source: "15", target: "16", type: "step", sourceHandle: "bottom" },
        { id: "e17", source: "16", target: "17", type: "step", sourceHandle: "left" },
        { id: "e18", source: "16", target: "18", type: "step", sourceHandle: "left" },
        { id: "e19", source: "16", target: "19", type: "step", sourceHandle: "left" },
        { id: "e20", source: "16", target: "20", type: "step", sourceHandle: "left" },
        { id: "e21", source: "1", target: "21", type: "step", sourceHandle: "bottom" },
        { id: "e22", source: "21", target: "22", type: "step", sourceHandle: "bottom" },
        { id: "e23", source: "22", target: "23", type: "step", sourceHandle: "left" },
        { id: "e24", source: "22", target: "24", type: "step", sourceHandle: "left" },
        { id: "e25", source: "22", target: "25", type: "step", sourceHandle: "left" },
        { id: "e26", source: "22", target: "26", type: "step", sourceHandle: "left" },
        { id: "e27", source: "22", target: "27", type: "step", sourceHandle: "left" },
        { id: "e28", source: "1", target: "28", type: "step", sourceHandle: "right" },
        { id: "e29", source: "28", target: "29", type: "step", sourceHandle: "left" },
        { id: "e30", source: "28", target: "30", type: "step", sourceHandle: "left" }
    ],
};

export const documents = [
    { label: "แผนผัง (PDF)", href: "/docs/structure.pdf" },
    { label: "แผนผัง (PNG)", href: "/docs/structure.png" },
];
