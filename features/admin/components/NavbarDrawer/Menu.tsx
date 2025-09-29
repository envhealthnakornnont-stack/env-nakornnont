"use client"
import Link from "next/link";
import Image from "next/image";
import {
    SettingIcon,
    IdentificationIcon,
    NewspaperIcon,
    OfficeIcon,
    CpuSolidIcon,
    UserGroupIcon,
    CalendarSolidIcon,
    BanknotesIcon,
    PhotoIcon,
    DocumentIcon,
    Chartpie
} from "@/config/iconConfig";
import { usePathname } from "next/navigation";

interface MenuProps {
    role: string
}

const Menu = ({ role }: MenuProps) => {
    const pathname = usePathname();
    const isActive = (base: string) =>
        pathname === base || pathname.startsWith(`${base}/`) ? "active" : "";

    return (
        <div className="flex flex-col gap-4">
            <li>
                <Link href={`/admin`} className="flex justify-center items-center gap-2 px-0 font-bold">
                    <Image
                        src="/mobile/mobile-logo.png"
                        width={48}
                        height={48}
                        alt="Picture of the author"
                        className="object-contain"
                    />
                    <div className="text-start text-xs">
                        <p>สำนักสาธารณสุขและสิ่งแวดล้อม</p>
                        <p>เทศบาลนครนนทบุรี</p>
                    </div>
                </Link>
            </li>
            <li>
                <Link href={`/admin/dashboard`} className={isActive(`/admin/dashboard`)}>
                    <Chartpie />
                    แดชบอร์ด
                </Link>
            </li>
            {role === "SUPERUSER"
                &&
                <li>
                    <details>
                        <summary>
                            <DocumentIcon />
                            จัดการแบนเนอร์
                        </summary>
                        <ul className="py-2">
                            <li className="py-2">
                                <Link href={`/admin/banner/video`} className={isActive(`/admin/banner/video`)}>
                                    <BanknotesIcon />
                                    แบนเนอร์ส่วนที่ 1
                                </Link>
                            </li>
                            <li>
                                <Link href={`/admin/banner/image`} className={isActive(`/admin/banner/image`)}>
                                    <PhotoIcon />
                                    แบนเนอร์ส่วนที่ 2
                                </Link>
                            </li>
                        </ul>
                    </details>
                </li>
            }
            {role === "SUPERUSER"
                &&
                <li>
                    <Link href={`/admin/e-service`} className={isActive(`/admin/e-service`)}>
                        <CpuSolidIcon />
                        จัดการระบบ E-Service
                    </Link>
                </li>
            }
            <li>
                <details>
                    <summary>
                        <DocumentIcon />
                        จัดการข้อมูลข่าวสาร
                    </summary>
                    <ul className="py-2">
                        <li className="py-2">
                            <Link href={`/admin/news/news-update`} className={isActive(`/admin/news/news-update`)}>
                                <NewspaperIcon />
                                ข่าวประชาสัมพันธ์
                            </Link>
                        </li>
                        <li>
                            <Link href={`/admin/news/activities`} className={isActive(`/admin/news/activities`)}>
                                <CalendarSolidIcon />
                                กิจกรรมของสำนัก
                            </Link>
                        </li>
                    </ul>
                </details>
            </li>
            {role === "SUPERUSER"
                &&
                <li>
                    <details>
                        <summary>
                            <OfficeIcon />
                            จัดการข้อมูลหน่วยงาน
                        </summary>
                        <ul className="py-2">
                            <li className="py-2">
                                <Link href={`/admin/agency/personnel`} className={isActive(`/admin/agency/personnel`)}>
                                    <UserGroupIcon />
                                    บุคลากร
                                </Link>
                            </li>
                        </ul>
                    </details>
                </li>
            }
            {role === "SUPERUSER"
                &&
                <li>
                    <Link href={`/admin/users`} className={isActive(`/admin/users`)}>
                        <IdentificationIcon />
                        จัดการระบบผู้ใช้งาน
                    </Link>
                </li>
            }
            <li>
                <Link href={`/admin/setting`} className={isActive(`/admin/setting`)}>
                    <SettingIcon />
                    ตั้งค่า
                </Link>
            </li>
        </div>
    )
}

export default Menu