import Breadcrumbs from "@/components/Breadcrumbs"
import Divider from "@/components/Divider";
import AccordionList from "@/features/users/components/Roles/AccordionList";
import Description from "@/features/users/components/Roles/Description";

const RolesSection = () => {

    const breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: "ข้อมูลหน่วยงาน", href: "/about/structure" },
        { label: "อำนาจหน้าที่", isCurrent: true },
    ];

    const accordionItems = [
        {
            title: "ฝ่ายบริหารงานทั่วไป",
            content: "มีหน้าที่รับผิดชอบเกี่ยวกับการกำหนดนโยบาย การควบคุมกำกับดูแล และอำนวยการดำเนินงานของงานบริหารทั่วไป และงานการเงินและบัญชี",
            link: { href: "/departments/general-affairs", label: "ไปยังฝ่ายบริหารงานทั่วไป" },
        },
        {
            title: "ส่วนส่งเสริมสาธารณสุข",
            content: "มีหน้าที่รับผิดชอบเกี่ยวกับการกำหนดนโยบาย การควบคุมกำกับดูแลและอำนวยการดำเนินงานของฝ่ายวิชาการและการประเมินผล ฝ่ายส่งเสริมสาธารณสุข",
            link: { href: "/departments/public-health-promotion", label: "ไปยังส่วนส่งเสริมสาธารณสุข" },
        },
        {
            title: "ส่วนบริการอนามัยสิ่งแวดล้อม",
            content: "มีหน้าที่รับผิดชอบเกี่ยวกับการกำหนดนโยบายการควบคุมกำกับดูแล และอำนวยการดำเนินงานของฝ่ายจัดการมูลฝอยและสิ่งปฏิกูล",
            link: { href: "/departments/environmental-health-services", label: "ไปยังส่วนบริการอนามัยสิ่งแวดล้อม" },
        },
        {
            title: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม",
            content: "มีหน้าที่รับผิดชอบเกี่ยวกับการกำหนดนโยบายการควบคุมกำกับดูแล และอำนวยการดำเนินงานของฝ่ายควบคุมและจัดการคุณภาพสิ่งแวดล้อม",
            link: { href: "/departments/environmental-health-promotion", label: "ไปยังส่วนส่งเสริมอนามัยสิ่งแวดล้อม" },
        },
    ];
    
    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <div>
                <div className="my-3">
                    <h1 className="sm:text-3xl text-2xl font-bold">อำนาจหน้าที่</h1>
                    <Divider />
                    <Description />
                </div>
                <AccordionList items={accordionItems} />
            </div>
        </>
    )
}

export default RolesSection