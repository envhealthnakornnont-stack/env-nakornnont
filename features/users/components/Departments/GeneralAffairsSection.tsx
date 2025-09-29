import Breadcrumbs from "@/components/Breadcrumbs"
import Divider from "@/components/Divider";
import GenericList from "@/components/GenericList";

const GeneralAffairsSection = () => {

    const breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: "หน่วยงานภายใน", href: "/departments/general" },
        { label: "ฝ่ายบริหารงานทั่วไป", isCurrent: true },
    ];

    const financeItems = {
        title: "2. งานการเงินและบัญชี",
        items: [
            {
                content: "จัดทำบัญชีเงินเดือน การเบิกจ่ายงบประมาณ",
            },
            {
                content: "การจัดทำบัญชีรับ – จ่ายของสำนักสาธารณสุขและสิ่งแวดล้อม ",
            },
            {
                content: "งานอื่นที่เกี่ยวข้องหรือที่ได้รับมอบหมาย ",
            }
        ],
    };

    const generalManagementItems = {
        title: "1. งานบริหารทั่วไป",
        items: [
            {
                content: "ปฏิบัติงานด้านสารบรรณและธุรการทั่วไป",
            },
            {
                content: "จัดทำบัญชีลงรับ - ส่ง หนังสือ การร่างโต้ตอบหนังสือ การจัดทำบันทึกสรุปการประชุม",
            },
            {
                content: "จัดทำประกาศ คำสั่ง การเวียน แจ้งหนังสือ การบันทึกข้อมูล",
            },
            {
                content:
                    "การเลื่อนขั้นเงินเดือนการดำเนินการทางวินัย ทะเบียนประวัติ การขอรับบำเหน็จบำนาญและเกษียณอายุ การขอพระราชทานเครื่องราชอิสริยาภรณ์ การประกาศเกียรติคุณ",
            },
            {
                content: "การดำเนินการตามพระราชบัญญัติประกันสังคม พ.ศ. 2533",
            },
            {
                content:
                    "การดำเนินการพัสดุ การจัดซื้อ - จัดจ้าง การจัดทำทะเบียนทรัพย์สิน การซ่อมบำรุงครุภัณฑ์ยานพาหนะและสิ่งก่อสร้างของสำนัก",
            },
            {
                content: "การโอนงบประมาณรายจ่ายประจำปี",
            },
            {
                content: "งานเกี่ยวกับการจัดทำฎีกา และควบคุมงบประมาณ",
            },
            {
                content: "งานอื่นที่เกี่ยวข้องหรือตามที่ได้รับมอบหมาย",
            },
        ],
    };
    
    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <div className="my-3">
                <h1 className="text-2xl sm:text-3xl font-bold">ฝ่ายบริหารงานทั่วไป</h1>
                <Divider />
                <p>มีหน้าที่รับผิดชอบเกี่ยวกับการกำหนดนโยบาย การควบคุมกำกับดูแล และอำนวยการดำเนินงานของงานบริหารทั่วไป และงานการเงินและบัญชี ดังนี้</p>
            </div>
            <GenericList {...generalManagementItems} />
            <GenericList {...financeItems} />
        </>
    )
}

export default GeneralAffairsSection