import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";

type Trail = { label: string; href: string; current?: boolean }[];

export default function Breadcrumbs({ trail }: { trail: Trail }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-2">
            <Breadcrumb>
                <BreadcrumbList className="text-sm">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={trail[0].href}>{trail[0].label}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {trail.slice(1).map((t, i) => (
                        <Fragment key={t.href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {t.current ? (
                                    <BreadcrumbPage className="truncate max-w-[60vw] sm:max-w-none">
                                        {t.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={t.href}>{t.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </nav>
    );
}

import { Fragment } from "react";
