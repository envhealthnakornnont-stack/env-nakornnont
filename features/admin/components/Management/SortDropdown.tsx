import { ArrowUpDownIcon } from "@/config/iconConfig";
import { useState } from "react";

interface SortDropdownProps {
    onSort: (option: string) => void;
    itemType: "Personnel" | "User" | "NewsItems" | "ActivityItems" | "E_Service" | null;
}

const SortDropdown = ({ onSort, itemType }: SortDropdownProps) => {

    const [sortOption, setSortOption] = useState(`${itemType === "Personnel" ? "ชื่อ-นามสกุล" : itemType === "User" ? "ผู้ใช้งาน" : itemType === "NewsItems" ? "ชื่อข่าวสาร" : itemType === "ActivityItems" ? "ชื่อกิจกรรม" : itemType === "E_Service" ? "ชื่อบริการ" : ""}`);

    const handleSortChange = (option: string) => {
        setSortOption(option);
        onSort(option);
    };

    return (
        <div className="dropdown dropdown-end sm:mx-2">
            <div tabIndex={0} role="button" className="btn btn-sm px-2 lg:btn-md btn-outline m-1">
                <span className='hidden lg:inline-flex'>เรียงตาม: {sortOption}</span>
                <span className='flex items-center justify-center lg:hidden'><ArrowUpDownIcon />{sortOption}</span>
            </div>
            {itemType === "Personnel" && (
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <button onClick={() => handleSortChange("ชื่อ-นามสกุล")}>ชื่อ-นามสกุล</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ตำแหน่ง")}>ตำแหน่ง</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ชื่อตำแหน่ง")}>ชื่อตำแหน่ง</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่สร้าง")}>วันที่สร้าง</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่อัปเดต")}>วันที่อัปเดต</button>
                    </li>
                </ul>
            )}
            {itemType === "User" && (
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <button onClick={() => handleSortChange("ผู้ใช้งาน")}>ผู้ใช้งาน</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ส่วนงาน")}>ส่วนงาน</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่สร้าง")}>วันที่สร้าง</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่อัปเดต")}>วันที่อัปเดต</button>
                    </li>
                </ul>
            )}
            {itemType === "NewsItems" && (
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <button onClick={() => handleSortChange("ชื่อข่าวสาร")}>ชื่อข่าวสาร</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ผู้เขียน")}>ผู้เขียน</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ส่วนงาน")}>ส่วนงาน</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่สร้าง")}>วันที่สร้าง</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่อัปเดต")}>วันที่อัปเดต</button>
                    </li>
                </ul>
            )}
            {itemType === "ActivityItems" && (
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <button onClick={() => handleSortChange("ชื่อข่าวสาร")}>ชื่อกิจกรรม</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ผู้เขียน")}>ผู้เขียน</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ส่วนงาน")}>ส่วนงาน</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่สร้าง")}>วันที่สร้าง</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่อัปเดต")}>วันที่อัปเดต</button>
                    </li>
                </ul>
            )}
            {itemType === "E_Service" && (
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <button onClick={() => handleSortChange("ชื่อบริการ")}>ชื่อบริการ</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("รูปบริการ")}>รูปบริการ</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("ลิงก์บริการ")}>ลิงก์บริการ</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่สร้าง")}>วันที่สร้าง</button>
                    </li>
                    <li>
                        <button onClick={() => handleSortChange("วันที่อัปเดต")}>วันที่อัปเดต</button>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default SortDropdown