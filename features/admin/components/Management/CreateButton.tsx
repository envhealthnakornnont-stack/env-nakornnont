import { UserGroupIcon, UserplusSolidIcon, NewspaperIcon, CalendarSolidIcon, CpuSolidIcon } from "@/config/iconConfig";
import { Plus } from "lucide-react";
import Link from "next/link";

const CreateButton = ({ createLink, itemType }: { createLink: string, itemType: "Personnel" | "User" | "NewsItems" | "ActivityItems" | "E_Service" | null }) => {
    return (
        <div>
            <Link href={createLink} className="btn btn-sm lg:btn-md btn-primary px-2">
                <span className='hidden lg:inline-flex'>
                    {`สร้าง
                    ${itemType === "Personnel" ? "บุคลากร" : ""}
                    ${itemType === "User" ? "ผู้ใช้งาน" : ""}
                    ${itemType === "NewsItems" ? "ข่าวสาร" : ""}
                    ${itemType === "ActivityItems" ? "กิจกรรม" : ""}
                    ${itemType === "E_Service" ? " E_Service" : ""}
                    ${itemType === null ? "ข้อมูล" : ""}`
                    }
                </span>
                <span className='inline-flex lg:hidden'>
                    {itemType === "Personnel" && <UserGroupIcon />}
                    {itemType === "User" && <UserplusSolidIcon />}
                    {itemType === "NewsItems" && <NewspaperIcon />}
                    {itemType === "ActivityItems" && <CalendarSolidIcon />}
                    {itemType === "E_Service" && <CpuSolidIcon />}
                    {itemType === null && <Plus size={20} />}
                </span>
            </Link>
        </div>
    )
}

export default CreateButton