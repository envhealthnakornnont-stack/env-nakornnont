import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Missions({ items }: { items: string[] }) {
    return (
        <Card id="missions" className="scroll-mt-28 md:scroll-mt-32">
            <CardHeader>
                <CardTitle>ภารกิจ/หน้าที่</CardTitle>
                <CardDescription>สิ่งที่หน่วยงานรับผิดชอบเป็นประจำ</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="grid gap-3">
                    {items.map((m, i) => (
                        <li key={i} className="rounded-lg border p-3 leading-relaxed bg-muted/30">{m}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
