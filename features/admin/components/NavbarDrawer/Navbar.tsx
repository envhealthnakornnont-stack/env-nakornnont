import Theme from "@/components/Theme";
import NavbarDrawerButton from "@/features/users/components/NavbarDrawer/NavbarDrawerButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import TitleBar from "@/features/admin/components/NavbarDrawer/TitleBar";
import prisma from "@/lib/prisma"
import Image from "next/image";

const Navbar = async () => {

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
        console.error("User not found in database for email:", session.user.email);
        return null; // ไม่แสดง Navbar ถ้าไม่พบ User
    }

    return (
        <div className={`navbar bg-base-100 w-full justify-end bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] shadow-sm sticky top-0`} style={{ zIndex: 100 }}>
            <div className="mx-3 xl:mx-5 flex-1 md:px-2">
                <TitleBar />
            </div>
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
                                    alt={`${user.firstname} ${user.lastname} Avatar`} />
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
            <div className="md:flex flex-col items-start mx-2 px-2 hidden">
                <p className="font-bold">{user.firstname} {user.lastname}</p>
                <p className="text-xs">{user.role}</p>
            </div>
            <Theme />
            <NavbarDrawerButton />
        </div>
    )
}

export default Navbar