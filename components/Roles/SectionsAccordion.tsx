import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, ArrowRight } from "lucide-react";

type SectionItem = { key: string; title: string; body: string; href: string };
export default function SectionsAccordion({ items }: { items: SectionItem[] }) {
    return (
        <section className="mx-auto max-w-screen-xl pb-6">
            <div className="mb-4 flex items-center gap-2">
                <Activity className="size-5" />
                <h2 className="text-lg font-semibold sm:text-xl">โครงสร้างภารกิจตามส่วน/ฝ่าย</h2>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Accordion type="multiple" className="divide-y">
                        {items.map((s, idx) => (
                            <AccordionItem key={s.key} value={s.key} className="px-4">
                                <AccordionTrigger className="text-left text-base sm:text-lg">
                                    <span className="font-medium">{idx + 1}. {s.title}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-5">
                                        <div className="sm:col-span-4">
                                            <p className="text-sm text-muted-foreground">{s.body}</p>
                                        </div>
                                        <div className="sm:col-span-1 flex items-start sm:justify-end">
                                            <Button asChild variant="secondary">
                                                <Link href={s.href} className="inline-flex items-center">
                                                    ดูรายละเอียด
                                                    <ArrowRight className="ml-2 size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </section>
    );
}