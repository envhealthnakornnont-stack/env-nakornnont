import Drawer from "@/features/admin/components/NavbarDrawer/Drawer"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import AdminShell from "@/components/Sidebar/AdminShell";
import { Role } from "@/components/Sidebar/types";

export const metadata = {
    title: "แดชบอร์ดผู้ดูแลระบบ | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description: "ระบบจัดการข้อมูลข่าวสาร แบนเนอร์ และเนื้อหาเว็บไซต์สำหรับเจ้าหน้าที่ผู้ดูแลระบบ",
    keywords: ["Admin Dashboard", "ระบบจัดการเว็บไซต์", "แอดมิน", "สำนักสาธารณสุข"],
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;


    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: true,
            avatar: true,
        },
    });


    if (!user) return null;


    return (
        <AdminShell
            user={{
                id: String(user.id),
                name: `${user.firstname} ${user.lastname}`.trim(),
                email: user.email ?? undefined,
                role: (user.role as Role) ?? 'USER',
                avatar: user.avatar ?? undefined,
            }}
        >
            {children}
        </AdminShell>
    );
}