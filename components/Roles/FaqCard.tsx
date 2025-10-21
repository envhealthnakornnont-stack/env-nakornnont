import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FaqCard({ items }: { items: { q: string; a: string }[] }) {
    return (
        <section className="mx-auto max-w-screen-xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2">คำถามที่พบบ่อย</CardTitle>
                    <CardDescription>ตอบสั้น ชัด ตรงประเด็น</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {items.map((f, i) => (
                            <AccordionItem key={i} value={`faq-${i}`}>
                                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                                <AccordionContent className="leading-relaxed">{f.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </section>
    );
}