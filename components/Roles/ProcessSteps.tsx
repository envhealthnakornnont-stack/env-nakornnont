import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ProcessSteps({ items }: { items: { step: string; detail: string }[] }) {
    return (
        <section className="mx-auto max-w-screen-xl pb-6">
            <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <h2 className="text-lg font-semibold sm:text-xl">กระบวนการทำงาน (ย่อ)</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {items.map((s, i) => (
                    <Card key={s.step}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">ขั้นที่ {i + 1}</CardTitle>
                            <CardDescription>{s.step}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {s.detail}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}