import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Images, FileText, CalendarDays, Building2, Users, Cpu, Settings, } from "lucide-react";
import { Role } from "@/components/Sidebar/types";

export type NavItem = {
    title: string;
    href?: string;
    icon?: LucideIcon;
    roles?: Role[];
    children?: NavItem[];
    badge?: string;
};

export const NAV_SECTIONS: NavItem[] = [
    {
        title: "แดชบอร์ด",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "จัดการแบนเนอร์",
        icon: Images,
        roles: ["SUPERUSER"],
        children: [
            { title: "แบนเนอร์ส่วนที่ 1", href: "/admin/banner/video", icon: FileText },
            { title: "แบนเนอร์ส่วนที่ 2", href: "/admin/banner/image", icon: Images },
        ],
    },
    {
        title: "จัดการระบบ E-Service",
        href: "/admin/e-service",
        icon: Cpu,
        roles: ["SUPERUSER"],
    },
    {
        title: "จัดการข้อมูลข่าวสาร",
        icon: FileText,
        children: [
            { title: "ข่าวประชาสัมพันธ์", href: "/admin/news/news-update", icon: FileText },
            { title: "กิจกรรมของสำนัก", href: "/admin/news/activities", icon: CalendarDays },
        ],
    },
    {
        title: "จัดการข้อมูลหน่วยงาน",
        icon: Building2,
        roles: ["SUPERUSER"],
        children: [
            { title: "บุคลากร", href: "/admin/agency/personnel", icon: Users },
        ],
    },
    {
        title: "จัดการระบบผู้ใช้งาน",
        href: "/admin/users",
        icon: Users,
        roles: ["SUPERUSER"],
    },
    {
        title: "ตั้งค่า",
        href: "/admin/setting",
        icon: Settings,
    },
];