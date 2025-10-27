import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DownloadsList({
    files,
}: { files?: { name: string; href: string; size?: string; updatedAt?: string }[] }) {
    if (!files?.length) return null;
    return (
        <Card id="downloads" className="scroll-mt-28 md:scroll-mt-32">
            <CardHeader>
                <CardTitle>แบบฟอร์ม/คู่มือ/ระเบียบ</CardTitle>
                <CardDescription>ไฟล์ที่ต้องใช้บ่อย อัปเดตล่าสุด</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {files.map((f) => (
                    <Link key={f.href} href={f.href}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition">
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
            </CardContent>
        </Card>
    );
}
