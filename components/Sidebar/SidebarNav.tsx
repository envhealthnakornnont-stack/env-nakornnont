"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NAV_SECTIONS, type NavItem, type Role } from "@/components/Sidebar/nav-config";
import type { AdminUser } from "./AdminShell";
import { cn } from "@/lib/utils";

function canView(role: string, item: NavItem) {
    return !item.roles || item.roles.includes(role as Role);
}

export default function SidebarNav({ user, onNavigate }: { user: AdminUser; onNavigate?: () => void }) {
    const pathname = usePathname();
    const active = (href?: string) => !!href && (pathname === href || pathname.startsWith(`${href}/`));

    return (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 py-3">
                <Link href="/admin" className="flex items-center gap-2">
                    <Image src="/mobile/mobile-logo.png" width={40} height={40} alt="Nonthaburi PHE" />
                    <div className="hidden sm:block leading-tight text-xs">
                        <p>สำนักสาธารณสุขและสิ่งแวดล้อม</p>
                        <p className="opacity-70">เทศบาลนครนนทบุรี</p>
                    </div>
                </Link>
            </div>
            <Separator />
            {/* Menu */}
            <ScrollArea className="flex-1 px-2 py-2">
                <nav className="space-y-1">
                    {NAV_SECTIONS.filter((s) => canView(user.role, s)).map((section, idx) => {
                        const Icon = section.icon as any;
                        if (section.children?.length) {
                            const anyActive = section.children.some((c) => active(c.href));
                            return (
                                <Accordion key={idx} type="single" collapsible defaultValue={anyActive ? `sec-${idx}` : undefined}>
                                    <AccordionItem value={`sec-${idx}`} className="border-b-0">
                                        <AccordionTrigger className={cn("px-2 rounded-md hover:bg-accent hover:text-accent-foreground", anyActive && "bg-accent text-accent-foreground")}
                                        >
                                            <div className="flex items-center gap-2">
                                                {Icon ? <Icon className="h-4 w-4" /> : null}
                                                <span className="text-sm font-medium">{section.title}</span>
                                                {section.badge && <Badge className="ml-2" variant="secondary">{section.badge}</Badge>}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1">
                                            <ul className="ml-7 space-y-1">
                                                {section.children.filter((c) => canView(user.role, c)).map((child, cidx) => (
                                                    <li key={cidx}>
                                                        <Link
                                                            href={child.href ?? "#"}
                                                            onClick={onNavigate}
                                                            className={cn(
                                                                "block rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                                                                active(child.href) && "bg-muted font-medium"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {child.icon ? <child.icon className="h-4 w-4 opacity-80" /> : null}
                                                                <span>{child.title}</span>
                                                                {child.badge && (
                                                                    <Badge variant="outline" className="ml-auto">
                                                                        {child.badge}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            );
                        }
                        return (
                            <Link
                                key={idx}
                                href={section.href ?? "#"}
                                onClick={onNavigate}
                                className={cn(
                                    "mx-1 flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                                    active(section.href) && "bg-accent text-accent-foreground"
                                )}
                            >
                                {Icon ? <Icon className="h-4 w-4" /> : null}
                                <span className="font-medium">{section.title}</span>
                                {section.badge && <Badge className="ml-auto" variant="secondary">{section.badge}</Badge>}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>
            <Separator />
            {/* User card + Sign out */}
            <div className="px-3 py-3">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full bg-muted">
                        {/* SSR path -> API proxy if needed */}
                        {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.avatar.startsWith("blob:") || user.avatar.startsWith("data:") ? user.avatar : `/api/uploads${user.avatar}`}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="grid h-full w-full place-items-center text-xs opacity-70">
                                {user.email?.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs opacity-70">{user.email}</p>
                        <p className="truncate text-[11px] opacity-70">{user.role}</p>
                    </div>
                </div>
                <div className="mt-2">
                    <Link
                        href="/auth/secure/gateway/login"
                        onClick={(e) => {
                            e.preventDefault();
                            import("next-auth/react").then(({ signOut }) =>
                                signOut({ callbackUrl: "/auth/secure/gateway/login" })
                            );
                        }}
                        className="inline-flex w-full items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                        ออกจากระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
}