import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface SortDropdownProps {
    onSort: (option: string) => void;
}

const SortDropdown = ({ onSort }: SortDropdownProps) => {

    const [sortOption, setSortOption] = useState("ลำดับแบนเนอร์");

    const handleSortChange = (option: string) => {
        setSortOption(option);
        onSort(option);
    };

    return (
        <div className="dropdown dropdown-end sm:mx-2">
            <div tabIndex={0} role="button" className="btn btn-sm px-2 lg:btn-md btn-outline m-1">
                <span className='hidden lg:inline-flex'>เรียงตาม: {sortOption}</span>
                <span className='flex items-center justify-center lg:hidden'><ArrowUpDown size={16}/>{sortOption}</span>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                    <button onClick={() => handleSortChange("ลำดับแบนเนอร์")}>ลำดับแบนเนอร์</button>
                </li>
                <li>
                    <button onClick={() => handleSortChange("ชื่อแบนเนอร์")}>ชื่อแบนเนอร์</button>
                </li>
                <li>
                    <button onClick={() => handleSortChange("วันที่อัปเดต")}>วันที่อัปเดต</button>
                </li>
            </ul>
        </div>
    )
}

export default SortDropdown