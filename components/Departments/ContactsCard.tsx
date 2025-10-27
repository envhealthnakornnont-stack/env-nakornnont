import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactsCard({
    contacts,
}: { contacts?: { name: string; role?: string; phone?: string; email?: string }[] }) {
    return (
        <Card id="contact" className="scroll-mt-28 md:scroll-mt-32">
            <CardHeader>
                <CardTitle>ติดต่อหน่วยงาน</CardTitle>
                <CardDescription>ช่องทางประสานงาน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {contacts?.map((c) => (
                    <div key={c.name} className="rounded-lg border p-3">
                        <div className="font-medium">{c.name}</div>
                        {c.role && <div className="text-sm">{c.role}</div>}
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            {c.phone && <div>โทร: {c.phone}</div>}
                            {c.email && <div className="break-words">อีเมล: {c.email}</div>}
                        </div>
                    </div>
                ))}
                <Separator />
                <div className="text-xs text-muted-foreground">
                    เวลาราชการ: จันทร์–ศุกร์ 08:30–16:30 น. (เว้นวันหยุดราชการ)
                </div>
            </CardContent>
        </Card>
    );
}
