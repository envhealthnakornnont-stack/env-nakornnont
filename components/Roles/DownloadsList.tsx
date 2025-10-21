import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DownloadItem } from "./types";

export default function DownloadsList({ items }: { items: DownloadItem[] }) {
    return (
        <section id="downloads" className="mx-auto max-w-screen-xl scroll-mt-28 md:scroll-mt-32">
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>เอกสาร/มาตรฐานที่เกี่ยวข้อง</CardTitle>
                    <CardDescription>ไฟล์ที่ต้องใช้บ่อย อัปเดตล่าสุด</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        {items.map((f, i) => (
                            <Link
                                key={i}
                                href={f.href}
                                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition"
                            >
                                <div>
                                    <div className="font-medium">{f.name}</div>
                                    {(f.size || f.updatedAt) && (
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {f.size ? `ขนาด ${f.size}` : ""}{f.size && f.updatedAt ? " · " : ""}{f.updatedAt ? `อัปเดต ${f.updatedAt}` : ""}
                                        </div>
                                    )}
                                </div>
                                <Button size="sm" variant="secondary">ดาวน์โหลด</Button>
                            </Link>
                        ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href="/public-services">ไปที่ E‑Service</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/about/structure">ดูโครงสร้างหน่วยงาน</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}