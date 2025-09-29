import Breadcrumbs from "@/components/Breadcrumbs"
import AvatarGrid from "@/features/users/components/Management/AvatarGrid";
import { Personnel } from "@/types/publicTypes";

const resolveLevel = (position: string): number => {
    if (/ผู้อำนวยการสำนัก/i.test(position)) return 1;
    if (/ผู้อำนวยการส่วน/i.test(position)) return 2;
    if (/หัวหน้าฝ่าย/i.test(position)) return 3;
    return 0; // ไม่ตรงเงื่อนไขใด ๆ
};

async function getPersonnel(): Promise<(Personnel & { level: number })[]> {
    const baseURL = process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${baseURL}/api/agency/personnel`, {
        next: {
            revalidate: 30
        },
    });
    const data = await res.json()
    const raw: Personnel[] = data;

    return raw.map((item) => ({
        ...item,
        level: resolveLevel(item.position),
    })).filter(p => p.level > 0);
}


const ManagementSection = async () => {
    const breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: "ข้อมูลหน่วยงาน" },
        { label: "บุคลากร", href: "/about/personnel/management" },
        { label: "ผู้บริหาร", isCurrent: true },
    ];

    const personnel = await getPersonnel();

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-3">
                <h1 className="sm:text-3xl text-2xl font-bold">ผู้บริหาร</h1>
                <div className="flex w-full flex-col border-opacity-50">
                    <div className="divider"></div>
                </div>
            </div>
            <AvatarGrid personnel={personnel} level={1} />
            <AvatarGrid personnel={personnel} level={2} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
            <AvatarGrid personnel={personnel} level={3} />
        </>
    )
}

export default ManagementSection