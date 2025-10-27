import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapDialog from "./MapDialog";
import type { ContactPoint } from "./types";

type Props = { point: ContactPoint };

export default function ContactCard({ point }: Props) {
    return (
        <Card>
            <CardHeader><CardTitle>{point.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                    {point.logoSrc && (
                        <Image src={point.logoSrc} alt="โลโก้" width={40} height={40} className="rounded-md ring-1 ring-border shrink-0" />
                    )}
                    <p className="text-muted-foreground break-words hyphens-auto [text-wrap:pretty]">{point.address}</p>
                </div>

                {point.phones && point.phones.length > 0 && (
                    <dl className="grid grid-cols-1 gap-y-2 lg:grid-cols-[max-content,1fr] lg:gap-x-3 lg:gap-y-1 text-[13px] lg:text-sm">
                        {point.phones.map((p) => (
                            <div key={p.label} className="contents">
                                <dt className="text-muted-foreground whitespace-nowrap">{p.label}:</dt>
                                <dd className="font-medium min-w-0 break-all [overflow-wrap:anywhere] hyphens-auto">{p.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                {point.email && point.email.length > 0 && (
                    <dl className="grid grid-cols-1 gap-y-2 lg:grid-cols-[max-content,1fr] lg:gap-x-3 lg:gap-y-1 text-[13px] lg:text-sm">
                        <div key={point.email} className="contents">
                            <dt className="text-muted-foreground whitespace-nowrap">อีเมล:</dt>
                            <dd className="font-medium min-w-0 break-all [overflow-wrap:anywhere] hyphens-auto">{point.email}</dd>
                        </div>
                    </dl>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {point.email && (
                        <Button asChild variant="outline" className="w-full sm:w-auto">
                            <Link href={`mailto:${point.email}`}>ส่งอีเมล</Link>
                        </Button>
                    )}
                    <MapDialog title={`แผนที่${point.title}`} address={point.address} embedUrl={point.mapsEmbedUrl} linkUrl={point.mapsLinkUrl} />
                </div>
            </CardContent>
        </Card>
    );
}
