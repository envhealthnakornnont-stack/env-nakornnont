import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Menu from "@/features/admin/components/NavbarDrawer/Menu";
import SignOut from "@/features/admin/components/NavbarDrawer/SignOut";
import prisma from "@/lib/prisma"
import Image from "next/image";

const SideMenu = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return null; // ไม่แสดง Navbar ถ้าไม่มี Session
    }

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ session.user.id
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { firstname: true, lastname: true, email: true, role: true, avatar: true },
    });

    const resolvePreviewSrc = (previewUrl: string): string => {
        if (previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")) {
            return previewUrl; // สำหรับ preview ชั่วคราว
        }
        return `/api/uploads${previewUrl}`; // เช่น originalAvatar = "/avatar/xxx.png"
    };

    // ตรวจสอบว่าพบ user หรือไม่
    if (!user) {
        throw new Error("User not found in the database");
    }

    return (
        <ul className="menu bg-base-100 min-h-full w-80 p-4 justify-between border-r border-base-300">
            <Menu role={user.role}/>
            <div className="flex flex-col gap-10 py-5">
                <div className="flex flex-col items-center gap-2">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            {user.avatar
                                ?
                                <div className="avatar">
                                    <div className="mask mask-circle h-10 w-10 bg-base-300">
                                        <Image
                                            src={resolvePreviewSrc(user.avatar)}
                                            width={40}
                                            height={40}
                                            alt="Avatar Tailwind CSS Component" />
                                    </div>
                                </div>
                                :
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-10 rounded-full">
                                        <span className="text-base">{user.email.slice(0, 2).toUpperCase()}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <p className="font-bold text-base">{user.firstname} {user.lastname}</p>
                    <p className="text-sm">{user.email}</p>
                    <p className="text-xs">{user.role}</p>
                </div>
                <li>
                    <SignOut />
                </li>
            </div>
        </ul>
    )
}

export default SideMenu