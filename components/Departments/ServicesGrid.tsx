import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicesGrid({
    services,
}: { services: { title: string; desc?: string; link?: string }[] }) {
    return (
        <Card id="services" className="scroll-mt-28 md:scroll-mt-32">
            <CardHeader>
                <CardTitle>บริการ/งานหลัก</CardTitle>
                <CardDescription>เข้าถึงบริการออนไลน์และข้อมูลที่เกี่ยวข้อง</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {services.map((s) => (
                    <Link key={s.title} href={s.link || "#"} className="group">
                        <div className="rounded-xl border p-4 transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
                            <div className="font-medium">{s.title}</div>
                            {s.desc && <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>}
                            <div className="mt-3 text-sm underline underline-offset-4">ดูรายละเอียด</div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
