"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQAccordion({ faqs }: { faqs?: { q: string; a: string }[] }) {
    if (!faqs?.length) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle>คำถามที่พบบ่อย</CardTitle>
                <CardDescription>ตอบสั้น ชัด ตรงประเด็น</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((f, i) => (
                        <AccordionItem key={i} value={`faq-${i}`}>
                            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                            <AccordionContent className="leading-relaxed">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
