"use client";

import Link from "next/link";
import { FacebookIcon, ShareIcon, LineIcon, XTwitterIcon, MailIcon, CopyClipboardIcon } from "@/config/iconConfig";
import { usePathname } from "next/navigation";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

const ShareButton = () => {

    const pathname = usePathname();
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${pathname}`;
    const { showAlert, copyToClipboard } = useCopyToClipboard();

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle btn-sm shadow-md">
                <ShareIcon />
            </div>
            <div tabIndex={0} className="card compact dropdown-content bg-base-200 rounded-box z-[1] w-20 shadow top-10">
                <div tabIndex={0} className="card-body">
                    <Link className="btn btn-circle border-0 bg-primary hover:bg-primary/65 shadow-md" href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`} target="_blank">
                        <FacebookIcon />
                    </Link>
                    <Link className="btn btn-circle border-0 bg-accent hover:bg-accent/65" href={`https://social-plugins.line.me/lineit/share?url=${fullUrl}`} target="_blank">
                        <LineIcon />
                    </Link>
                    <Link className="btn btn-circle border-0 bg-neutral hover:bg-neutral/65" href={`https://twitter.com/intent/tweet?url=${fullUrl}`} target="_blank">
                        <XTwitterIcon />
                    </Link>
                    <Link
                        className="btn btn-circle border-0 bg-base-100  "
                        href={`mailto:?subject=${encodeURIComponent("แชร์ข่าวสาร")}&body=${encodeURIComponent(`ดูข้อมูลเพิ่มเติมได้ที่: ${fullUrl}`)}`}>
                        <MailIcon />
                    </Link>
                    <button
                        className="btn btn-circle border-0 bg-base-100"
                        onClick={() => copyToClipboard(fullUrl)}
                    >
                        <CopyClipboardIcon />
                    </button>
                </div>
            </div>
            {/* 🔥 แจ้งเตือนเมื่อคัดลอกลิงก์สำเร็จ */}
            {showAlert && (
                <div role="alert" className="fixed bottom-4 right-4 py-3 px-5 border-0 alert rounded-lg shadow-lg w-80 flex items-center">
                    <span className="">✅ คัดลอกลิงก์สำเร็จ!</span>
                </div>
            )}
        </div>
    )
}

export default ShareButton