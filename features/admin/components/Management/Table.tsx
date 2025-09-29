import Row from "@/features/admin/components/Management/Row";
import { UserGroupIcon, UserIcon, ArrowDownIcon, NewspaperIcon, CalendarSolidIcon, CpuSolidIcon } from "@/config/iconConfig";
import { Dispatch, SetStateAction } from "react";
import { DataItem } from "@/types/userTypes";


interface DataItemTableProps {
    dataItem: DataItem[];
    setDataItems: Dispatch<SetStateAction<DataItem[]>>;
    ItemType: "Personnel" | "User" | "NewsItems" | "ActivityItems" | "E_Service" | null;
    sort: string;
    editLink: string;
    deleteApi: string
}

const Table = ({ dataItem, setDataItems, ItemType, sort, editLink, deleteApi }: DataItemTableProps) => {
    return (
        <table className="table table-sm ">
            <thead>
                {ItemType === "Personnel" && (
                    <tr>
                        <th><span className="inline-flex gap-1">ชื่อ-นามสกุล {sort === "ชื่อ-นามสกุล" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">ตำแหน่ง {sort === "ตำแหน่ง" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">ชื่อตำแหน่ง {sort === "ชื่อตำแหน่ง" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่สร้าง {sort === "วันที่สร้าง" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่อัปเดต {sort === "วันที่อัปเดต" ? <ArrowDownIcon /> : ""}</span></th>
                        <th></th>
                    </tr>
                )}
                {ItemType === "User" && (
                    <tr>
                        <th><span className="inline-flex gap-1">ผู้ใช้งาน {sort === "ผู้ใช้งาน" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">ส่วนงาน {sort === "ส่วนงาน" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่สร้าง {sort === "วันที่สร้าง" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่อัปเดต {sort === "วันที่อัปเดต" ? <ArrowDownIcon /> : ""}</span></th>
                        <th></th>
                    </tr>
                )}
                {ItemType === "NewsItems" && (
                    <tr>
                        <th><span className="inline-flex gap-1">ชื่อข่าวสาร {sort === "ชื่อข่าวสาร" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">ผู้เขียน {sort === "ผู้เขียน" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">ส่วนงาน {sort === "ส่วนงาน" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่สร้าง {sort === "วันที่สร้าง" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่อัปเดต {sort === "วันที่อัปเดต" ? <ArrowDownIcon /> : ""}</span></th>
                        <th></th>
                    </tr>
                )}
                {ItemType === "ActivityItems" && (
                    <tr>
                        <th><span className="inline-flex gap-1">ชื่อกิจกรรม {sort === "ชื่อกิจกรรม" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">ผู้เขียน {sort === "ผู้เขียน" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">ส่วนงาน {sort === "ส่วนงาน" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่สร้าง {sort === "วันที่สร้าง" ? <ArrowDownIcon /> : ""}</span></th>
                        <th><span className="inline-flex gap-1">วันที่อัปเดต {sort === "วันที่อัปเดต" ? <ArrowDownIcon /> : ""}</span></th>
                        <th></th>
                    </tr>
                )}
                {
                    ItemType === "E_Service" && (
                        <tr>
                            <th><span className="inline-flex gap-1">ชื่อบริการ {sort === "ชื่อบริการ" ? <ArrowDownIcon /> : ""}</span></th>
                            <th><span className="inline-flex gap-1">รูปบริการ {sort === "รูปบริการ" ? <ArrowDownIcon /> : ""}</span></th>
                            <th><span className="inline-flex gap-1">ลิงก์บริการ {sort === "ลิงก์บริการ" ? <ArrowDownIcon /> : ""}</span></th>
                            <th><span className="inline-flex gap-1">วันที่สร้าง {sort === "วันที่สร้าง" ? <ArrowDownIcon /> : ""}</span></th>
                            <th><span className="inline-flex gap-1">วันที่อัปเดต {sort === "วันที่อัปเดต" ? <ArrowDownIcon /> : ""}</span></th>
                            <th></th>
                        </tr>
                    )
                }
            </thead>
            <tbody>
                {dataItem.length > 0 ? (
                    dataItem.map((item) => (
                        <Row key={item.id} ItemType={ItemType} dataItem={item} setDataItems={setDataItems} editLink={editLink} deleteApi={deleteApi} />
                    ))
                ) : (
                    <tr>
                        <td colSpan={7} className="text-center">
                            <div className="mask mask-circle bg-base-300 w-11 h-11 rounded-full flex items-center justify-center mx-auto mt-16 mb-3">
                                {ItemType === "Personnel" && <UserGroupIcon />}
                                {ItemType === "User" && <UserIcon />}
                                {ItemType === "NewsItems" && <NewspaperIcon />}
                                {ItemType === "ActivityItems" && <CalendarSolidIcon />}
                                {ItemType === "E_Service" && <CpuSolidIcon />}
                            </div>
                            <p className="text-lg py-2">{`ไม่พบข้อมูล${ItemType === "Personnel" ? "บุคลากร" : ""}${ItemType === "User" ? "ผู้ใช้งาน" : ""}${ItemType === "NewsItems" ? "ข่าวประชาสัมพันธ์" : ""}${ItemType === "ActivityItems" ? "ข่าวกิจกรรม" : ""}${ItemType === "E_Service" ? " E_Service" : ""}`}</p>
                            <p className="mb-16">
                                {`${ItemType === null ? "กรุณาสร้างข้อมูล" : "ลองเปลี่ยนคำค้นหาของคุณ"}`}
                            </p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
