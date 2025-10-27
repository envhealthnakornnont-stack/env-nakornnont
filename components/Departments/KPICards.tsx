import { Card, CardContent } from "@/components/ui/card";

export default function KPICards({ kpis }: { kpis?: { label: string; value: string }[] }) {
    if (!kpis?.length) return null;
    return (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
            {kpis.map((k) => (
                <Card key={k.label} className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-xl md:text-2xl font-semibold">{k.value}</div>
                        <div className="text-sm text-muted-foreground">{k.label}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
