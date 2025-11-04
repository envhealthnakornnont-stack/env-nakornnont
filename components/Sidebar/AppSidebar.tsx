"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { NAV_SECTIONS, type NavItem } from "@/components/Sidebar/NavConfig";
import type { AdminUser } from "@/components/Sidebar/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User2 } from "lucide-react";
import { Role } from "@/components/Sidebar/types";
import { cn } from "@/lib/utils";

function canView(role: string, item: NavItem) {
    return !item.roles || item.roles.includes(role as Role);
}

export default function AppSidebar({ user }: { user: AdminUser }) {
    const pathname = usePathname();
    const { state, isMobile } = useSidebar();
    const collapsed = state === "collapsed";

    const active = (href?: string) => !!href && (pathname === href || pathname.startsWith(`${href}/`));
    const avatarSrc = user.avatar
        ? (user.avatar.startsWith("blob:") || user.avatar.startsWith("data:")
            ? user.avatar
            : `/api/uploads${user.avatar}`)
        : "";

    return (
        <Sidebar collapsible="icon"> {/* icon-collapse บนเดสก์ท็อป + offcanvas บนมือถือโดยอัตโนมัติ */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/admin/dashboard">
                            <SidebarMenuButton size="lg" className={cn("gap-2 items-center", collapsed ? "justify-center" : "justify-start")}>
                                <span className="relative h-6 w-6 shrink-0">
                                    <Image
                                        src="/mobile/mobile-logo.png"
                                        alt="Nonthaburi PHE"
                                        fill
                                        sizes="24px"
                                        className="object-contain"
                                        priority
                                    />
                                </span>
                                {!collapsed && (
                                    <div className="grid text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            สำนักสาธารณสุขและสิ่งแวดล้อม
                                        </span>
                                        <span className="truncate text-xs opacity-70">
                                            เทศบาลนครนนทบุรี
                                        </span>
                                    </div>
                                )}
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* กลุ่มเมนูหลัก */}
                {NAV_SECTIONS.filter((s) => canView(user.role, s)).map((section, idx) => {
                    const Icon = section.icon as any;
                    if (section.children?.length) {
                        return (
                            <SidebarGroup key={idx}>
                                <SidebarGroupLabel className="text-xs">{section.title}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {section.children.filter((c) => canView(user.role, c)).map((child, cidx) => (
                                            <SidebarMenuItem key={cidx}>
                                                <SidebarMenuButton asChild tooltip={child.title} isActive={active(child.href)}>
                                                    <Link href={child.href ?? "#"}>
                                                        {child.icon ? <child.icon className="h-4 w-4" /> : null}
                                                        <span>{child.title}</span>
                                                        {child.badge && <Badge variant="secondary" className="ml-auto">{child.badge}</Badge>}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        );
                    }

                    return (
                        <SidebarGroup key={idx}>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip={section.title} isActive={active(section.href)}>
                                            <Link href={section.href ?? "#"}>
                                                {Icon ? <Icon className="h-4 w-4" /> : null}
                                                <span>{section.title}</span>
                                                {section.badge && <Badge variant="secondary" className="ml-auto">{section.badge}</Badge>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {/* collapsed = แสดงเฉพาะ avatar; expanded = avatar + ชื่อ/role + ChevronDown */}
                                <SidebarMenuButton
                                    size={collapsed ? "default" : "lg"}
                                    className={cn("gap-2", collapsed ? "justify-center" : "justify-start")}
                                    aria-label={collapsed ? "เมนูผู้ใช้" : undefined}
                                >
                                    {/* avatar (Next/Image) */}
                                    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted">
                                        {avatarSrc ? (
                                            <Image
                                                src={avatarSrc}
                                                alt={user.name}
                                                fill
                                                sizes="28px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="grid h-full w-full place-items-center text-[10px] opacity-70">
                                                {user.email?.slice(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                    </span>

                                    {/* ข้อความโปรไฟล์: โชว์เฉพาะตอน expanded */}
                                    {!collapsed && (
                                        <>
                                            <div className="grid text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{user.name}</span>
                                                <span className="truncate text-xs opacity-70">{user.role}</span>
                                            </div>
                                            {/* ChevronDown โชว์เฉพาะตอน expanded */}
                                            <ChevronDown className="ml-auto" />
                                        </>
                                    )}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side={collapsed || isMobile ? "right" : "top"}
                                align={collapsed || isMobile ? "start" : "center"}
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem asChild>
                                    <a href="/admin/account" className="flex items-center gap-2">
                                        <User2 className="h-4 w-4" />
                                        โปรไฟล์ & การตั้งค่า
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        import("next-auth/react").then(({ signOut }) =>
                                            signOut({ callbackUrl: "/auth/secure/gateway/login" })
                                        )
                                    }
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    ออกจากระบบ
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>


            <SidebarRail />
        </Sidebar>
    );
}