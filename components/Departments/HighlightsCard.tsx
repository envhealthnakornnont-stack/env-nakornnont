import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HighlightsCard({ items }: { items?: { label: string; href: string }[] }) {
    if (!items?.length) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle>ไฮไลต์ล่าสุด</CardTitle>
                <CardDescription>ข่าว/กิจกรรมที่เกี่ยวข้อง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.map((h) => (
                    <Link key={h.href} href={h.href} className="block rounded-lg border p-3 hover:bg-muted/40">
                        <div className="font-medium">{h.label}</div>
                        <div className="text-xs underline underline-offset-4 mt-1">อ่านต่อ</div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
