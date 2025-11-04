"use client";


import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
// import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import UserMenu from "@/components/Sidebar/UserMenu";
import type { AdminUser } from "./AdminShell";
import { getPageTitle } from "@/components/Sidebar/page-title";


export default function Topbar({
    user,
    onOpenSidebar,
}: {
    user: AdminUser;
    onOpenSidebar: () => void;
}) {
    const pathname = usePathname();
    const title = getPageTitle(pathname);


    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-2 sm:px-4">
                {/* Mobile trigger */}
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
                    <Menu className="h-5 w-5" />
                </Button>


                <h1 className="line-clamp-1 text-base font-semibold sm:text-lg lg:text-xl">
                    {title}
                </h1>


                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                            <Input className="pl-8 w-[200px] lg:w-[260px]" placeholder="ค้นหาในระบบ..." />
                        </div>
                    </div>
                    <AnimatedThemeToggler />
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <UserMenu user={user} />
                </div>
            </div>
        </header>
    );
}