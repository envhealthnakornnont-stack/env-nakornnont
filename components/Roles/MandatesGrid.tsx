import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { ComponentType } from "react";

type Mandate = { icon: ComponentType<{ className?: string }>; title: string; desc: string };
export default function MandatesGrid({ items }: { items: Mandate[] }) {
    return (
        <section id="missions" data-anchor="missions" className="mx-auto max-w-screen-xl pb-6 scroll-mt-28 md:scroll-mt-32">
            <div className="mb-4 flex items-center gap-2">
                <Target className="size-5" />
                <h2 className="text-lg font-semibold sm:text-xl">ภารกิจหลัก</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => (
                    <Card key={m.title} className="transition-all duration-200 hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl border bg-card">
                                    <m.icon className="size-5" />
                                </div>
                                <CardTitle className="text-base sm:text-lg">{m.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{m.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}