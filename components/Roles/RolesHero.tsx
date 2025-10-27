import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RolesPageData } from "./types";

export default function RolesHero({ d }: { d: RolesPageData }) {
    return (
        <section className="relative overflow-hidden rounded-2xl border">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-100/80 via-sky-100/60 to-indigo-100/70 dark:from-emerald-900/30 dark:via-sky-900/20 dark:to-indigo-900/30" />
            <div className="p-6 md:p-10">
                {d.hero.badge && (
                    <Badge variant="secondary" className="mb-3">{d.hero.badge}</Badge>
                )}
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{d.title}</h1>
                {d.subtitle && (
                    <p className="mt-2 text-muted-foreground md:text-lg leading-relaxed">{d.subtitle}</p>
                )}


                {/* Quick actions */}
                <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="default">
                        <Link href="#missions" scroll>ภารกิจ</Link>
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                        <Link href="/public-services">บริการ</Link>
                    </Button>
                    {!!d.downloads?.length && (
                        <Button asChild size="sm" variant="outline">
                            <Link href="#downloads" scroll>เอกสาร/มาตรฐาน</Link>
                        </Button>
                    )}
                </div>

                {/* KPIs */}
                {d.kpis?.length ? (
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {d.kpis.map((k) => (
                            <Card key={k.label} className="shadow-sm">
                                <CardContent className="p-4">
                                    <div className="text-xl md:text-2xl font-semibold">{k.value}</div>
                                    <div className="text-sm text-muted-foreground">{k.label}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}