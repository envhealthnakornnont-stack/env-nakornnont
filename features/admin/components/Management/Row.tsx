import { EllipsisHorizontalIcon } from "@/config/iconConfig";
import axios from "axios";
import Link from "next/link";
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { DataItem, User, PersonnelItems, NewsItems, ActivityItems, E_ServiceItems } from "@/types/userTypes";
import Image from "next/image";

interface DataItemRowProps {
    dataItem: DataItem;
    setDataItems: Dispatch<SetStateAction<DataItem[]>>;
    ItemType: "Personnel" | "User" | "NewsItems" | "ActivityItems" | "E_Service" | null;
    editLink: string;
    deleteApi: string;
}

const Row = ({ dataItem, setDataItems, ItemType, editLink, deleteApi }: DataItemRowProps) => {
    const ImgPath = "/api/uploads"
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${deleteApi}${ItemType === "User" ? `${(dataItem as User).email}` : `${dataItem.id}`}`);
            setDataItems(prev => prev.filter(item => item.id !== dataItem.id));
        } catch (error: any) {
            setMessage(error.response?.data?.error || "เกิดข้อผิดพลาดในการลบข้อมูลบุคลากร");
        } finally {
            setDeleting(false);
        }
    };

    const openModal = () => modalRef.current?.showModal();
    const closeModal = () => modalRef.current?.close();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <tr key={dataItem.id} className="text-nowrap hover:bg-base-200/40 cursor-pointer">
            {ItemType === "Personnel" && (
                <>
                    <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                            <div className="avatar">
                                <div className="mask mask-squircle h-12 w-12 bg-base-300">
                                    <Image
                                        src={`${ImgPath}${(dataItem as PersonnelItems).image}`}
                                        className="object-top"
                                        width={48}
                                        height={48}
                                        alt={`${(dataItem as PersonnelItems).firstName} ${(dataItem as PersonnelItems).lastName}`} />
                                </div>
                            </div>
                            {(dataItem as PersonnelItems).firstName} {(dataItem as PersonnelItems).lastName}
                        </div>
                    </td>
                    <td className="px-4 py-2">{(dataItem as PersonnelItems).position}</td>
                    <td className="px-4 py-2">{(dataItem as PersonnelItems).positionName.length > 40 ? (dataItem as PersonnelItems).positionName.slice(0, 40) + "..." : (dataItem as PersonnelItems).positionName}</td>
                    <td className="px-4 py-2">{new Date((dataItem as PersonnelItems).createdAt).toLocaleDateString("th-TH")}</td>
                    <td className="px-4 py-2">{new Date((dataItem as PersonnelItems).updatedAt).toLocaleDateString("th-TH")}</td>
                </>
            )}
            {ItemType === "User" && (
                <>
                    <td>
                        <div className="flex items-center gap-3">
                            {
                                (dataItem as User).avatar ?
                                    <div className="avatar">
                                        <div className="mask mask-circle h-12 w-12 bg-base-300">
                                            <Image
                                                src={`${ImgPath}${(dataItem as User).avatar}`}
                                                width={48}
                                                height={48}
                                                alt={`${(dataItem as User).email}`} />
                                        </div>
                                    </div> :
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                            <span className="text-base">{(dataItem as User).email.slice(0, 2).toUpperCase()}</span>
                                        </div>
                                    </div>
                            }
                            <div>
                                <div className="font-bold">{(dataItem as User).firstname} {(dataItem as User).lastname}</div>
                                <div className="text-xs md:text-sm opacity-50">{(dataItem as User).email}</div>
                            </div>
                        </div>
                    </td>
                    <td>{(dataItem as User).department}</td>
                    <td>{(dataItem as User).createdAt && new Date((dataItem as User).createdAt).toLocaleDateString("th-TH")}</td>
                    <td>{(dataItem as User).updatedAt && new Date((dataItem as User).updatedAt).toLocaleDateString("th-TH")}</td>
                </>
            )}
            {ItemType === "NewsItems" && (
                <>
                    <td className="px-4 py-2">{(dataItem as NewsItems).title.length > 50 ? (dataItem as NewsItems).title.slice(0, 50) + "..." : (dataItem as NewsItems).title}</td>
                    <td className="px-4 py-2">{(dataItem as NewsItems).author.firstname} {(dataItem as NewsItems).author.lastname}</td>
                    <td className="px-4 py-2">{(dataItem as NewsItems).author.department}</td>
                    <td className="px-4 py-2">{new Date((dataItem as NewsItems).createdAt).toLocaleDateString("th-TH")}</td>
                    <td className="px-4 py-2">{new Date((dataItem as NewsItems).updatedAt).toLocaleDateString("th-TH")}</td>
                </>
            )}
            {ItemType === "ActivityItems" && (
                <>
                    <td className="px-4 py-2">{(dataItem as ActivityItems).title.length > 50 ? (dataItem as ActivityItems).title.slice(0, 50) + "..." : (dataItem as ActivityItems).title}</td>
                    <td className="px-4 py-2">{(dataItem as ActivityItems).author.firstname} {(dataItem as ActivityItems).author.lastname}</td>
                    <td className="px-4 py-2">{(dataItem as ActivityItems).author.department}</td>
                    <td className="px-4 py-2">{new Date((dataItem as ActivityItems).createdAt).toLocaleDateString("th-TH")}</td>
                    <td className="px-4 py-2">{new Date((dataItem as ActivityItems).updatedAt).toLocaleDateString("th-TH")}</td>
                </>
            )}
            {ItemType === "E_Service" && (
                <>
                    <td className="px-4 py-2">{(dataItem as E_ServiceItems).title}</td>
                    <td className="px-4 py-2">
                        <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                                <Image
                                    src={`${ImgPath}${(dataItem as E_ServiceItems).image}`}
                                    width={48}
                                    height={48}
                                    alt={`${(dataItem as E_ServiceItems).title}`} />
                            </div>
                        </div>
                    </td>
                    <td className="px-4 py-2">{(dataItem as E_ServiceItems).linkURL.length > 50 ? (dataItem as E_ServiceItems).linkURL.slice(0, 50) + "..." : (dataItem as E_ServiceItems).linkURL}</td>
                    <td className="px-4 py-2">{new Date((dataItem as E_ServiceItems).createdAt).toLocaleDateString("th-TH")}</td>
                    <td className="px-4 py-2">{new Date((dataItem as E_ServiceItems).updatedAt).toLocaleDateString("th-TH")}</td>
                </>
            )}
            <td>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-sm btn-ghost m-1">
                        <EllipsisHorizontalIcon />
                    </div>
                    <div tabIndex={0} className="dropdown-content card card-compact bg-base-100 rounded-lg z-[1] w-52 p-2 shadow">
                        <Link href={`${editLink}${ItemType === "User" ? `${(dataItem as User).email}` : `${dataItem.id}`}`} className='btn btn-ghost btn-sm'>
                            {`แก้ไข${ItemType === "Personnel" ? "บุคลากร" : ""}${ItemType === "User" ? "ผู้ใช้งาน" : ""}${ItemType === "NewsItems" ? "ข่าวสาร" : ""}${ItemType === "ActivityItems" ? "กิจกรรม" : ""}${ItemType === "E_Service" ? " E_Service" : ""}`}
                        </Link>
                        <button
                            className='btn btn-ghost btn-sm hover:bg-error/15 text-error'
                            onClick={openModal}
                            disabled={deleting}
                        >
                            {deleting ? `กำลังลบ${ItemType === "Personnel" ? "บุคลากร..." : ""}${ItemType === "User" ? "ผู้ใช้งาน..." : ""}${ItemType === "NewsItems" ? "ข่าวสาร..." : ""}${ItemType === "ActivityItems" ? "กิจกรรม..." : ""}${ItemType === "E_Service" ? "E_Service..." : ""}` : `ลบ${ItemType === "Personnel" ? "บุคลากร" : ""}${ItemType === "User" ? "ผู้ใช้งาน" : ""}${ItemType === "NewsItems" ? "ข่าวสาร" : ""}${ItemType === "ActivityItems" ? "กิจกรรม" : ""}${ItemType === "E_Service" ? " E_Service" : ""}`}
                        </button>
                        <dialog ref={modalRef} className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">{`ลบ${ItemType === "Personnel" ? "บุคลากร" : ""}${ItemType === "User" ? "ผู้ใช้งาน" : ""}${ItemType === "NewsItems" ? "ข่าวสาร" : ""}${ItemType === "ActivityItems" ? "กิจกรรม" : ""}${ItemType === "E_Service" ? "E_Service" : ""}`}</h3>
                                <p className="py-4">{`คุณแน่ใจหรือไม่ว่าต้องการลบ${ItemType === "Personnel" ? "บุคลากร?" : ""}${ItemType === "User" ? "ผู้ใช้งาน?" : ""}${ItemType === "NewsItems" ? "ข่าวสาร?" : ""}${ItemType === "ActivityItems" ? "กิจกรรม?" : ""}${ItemType === "E_Service" ? "E_Service?" : ""}`}</p>
                                <div className="modal-action">
                                    <form method="dialog" className="flex gap-2">
                                        <button className="btn btn-error" onClick={handleDelete}>
                                            {deleting ? `กำลังลบ${ItemType === "Personnel" ? "บุคลากร..." : ""}${ItemType === "User" ? "ผู้ใช้งาน..." : ""}${ItemType === "NewsItems" ? "ข่าวสาร..." : ""}${ItemType === "ActivityItems" ? "กิจกรรม..." : ""}${ItemType === "E_Service" ? "E_Service..." : ""}` : `ตกลง`}
                                        </button>
                                        <button className="btn btn-neutral" onClick={closeModal}>ยกเลิก</button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
                {message && (
                    <div
                        role="alert"
                        className={`fixed bottom-4 right-4 shadow-lg w-80 alert ${message.includes("สำเร็จ") ? "alert-success" : "alert-error"
                            }`}
                    >
                        <span>{message}</span>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default Row;
