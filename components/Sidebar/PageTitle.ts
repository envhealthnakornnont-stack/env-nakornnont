export const pageTitles: Record<string, string> = {
    "dashboard": "แดชบอร์ดภาพรวมระบบ",
    "banner": "จัดการแบนเนอร์",
    "e-service": "จัดการระบบ E-Service",
    "news/news-update": "ข่าวประชาสัมพันธ์",
    "news/activities": "กิจกรรมของสำนัก",
    "news/activities/create": "สร้างกิจกรรมใหม่",
    "news/activities/edit": "แก้ไขกิจกรรมสำนัก",
    "agency/personnel": "บุคลากร",
    "agency/personnel/create": "สร้างบุคลากรใหม่",
    "agency/personnel/edit": "แก้ไขข้อมูลบุคลากร",
    "users": "จัดการระบบผู้ใช้งาน",
    "users/create": "สร้างบัญชีผู้ใช้ใหม่",
    "users/edit": "แก้ไขบัญชีผู้ใช้งาน",
    "setting": "ตั้งค่า",
    "search": "ค้นหา"
};


export function getPageTitle(pathname: string) {
    const parts = pathname.split("/").filter(Boolean);
    const keys = parts.slice(1); // หลัง /admin
    for (let i = keys.length; i > 0; i--) {
        const k = keys.slice(0, i).join("/");
        if (pageTitles[k]) return pageTitles[k];
    }
    return "ไม่พบหน้า";
}