import { BannerImage,  BannerVideo} from "@/types/publicTypes";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

interface BannerCardProps {
    management?: string;
    banner: BannerImage | BannerVideo;
    editLink: string;
    deleteApi: string;
}

const BannerCard: React.FC<BannerCardProps> = ({ management, banner, editLink, deleteApi }) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${deleteApi}/${banner.id}`);
            window.location.reload();
        } catch (error: any) {
            console.log(error.response?.data?.error || "เกิดข้อผิดพลาดในการลบข้อมูลแบนเนอร์");
        } finally {
            setDeleting(false);
        }
    };

    const resolvePreviewSrc = (previewUrl: string): string => {
        if (previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")) {
            return previewUrl; // สำหรับ preview ชั่วคราว
        }
        return `/api/uploads${previewUrl}`; // เช่น originalAvatar = "/avatar/xxx.png"
    };

    const openModal = () => modalRef.current?.showModal();
    const closeModal = () => modalRef.current?.close();

    return (
        <div className="card card-compact bg-base-100 border-2 border-base-300 shadow-sm relative">
            <div className="absolute top-0 left-0 rounded-[14px] w-12 h-10 bg-primary/50 flex items-center justify-center  border border-primary">
                <span className="text-primary-content font-bold">{banner.sortOrder}</span>
            </div>
            {management === "video" ? (
                <video className="w-full h-48 object-cover rounded-t-[14px]" autoPlay muted playsInline loop>
                    <source src={resolvePreviewSrc((banner as BannerVideo).videoDesktop)} type="video/mp4" />
                </video>
            ) : (
                <figure>
                    <Image
                        height={824}
                        width={1440}
                        src={resolvePreviewSrc((banner as BannerImage).imageDesktop)}
                        alt={banner.title}
                        className="w-full h-48 object-cover rounded-t-[14px]"
                    />
                </figure>
            )}
            <div className="card-body">
                <h2 className="card-title">{banner.title} <div className={`badge ${banner.isActive ? "badge-success" : "badge-error"} badge-md`}></div></h2>
                <p className="text-sm text-gray-500">
                    Updated: {new Date(banner.updatedAt).toLocaleString()}
                </p>
                <div className="card-actions justify-end">
                    <Link href={`${editLink}`} className="btn btn-primary">
                        แก้ไข
                    </Link>
                    <button
                        onClick={openModal}
                        className="btn btn-error">
                        {deleting ? "กำลังลบ..." : "ลบ"}
                    </button>
                    <dialog ref={modalRef} className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">ลบแบนเนอร์</h3>
                            <p className="py-4">คุณแน่ใจหรือไม่ว่าต้องการลบแบนเนอร์?</p>
                            <div className="modal-action">
                                <form method="dialog" className="flex gap-2">
                                    <button className="btn btn-error" onClick={handleDelete}>
                                        {deleting ? "กำลังลบแบนเนอร์..." : "ตกลง"}
                                    </button>
                                    <button className="btn" onClick={closeModal}>ยกเลิก</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    );
};

export default BannerCard;
