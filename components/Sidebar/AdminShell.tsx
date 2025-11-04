"use client";


import * as React from "react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon } from "lucide-react";
import SidebarNav from "@/components/Sidebar/SidebarNav";
import Topbar from "@/components/Sidebar/Topbar";


export type AdminUser = {
    id: string;
    name: string;
    email?: string;
    role: string; // e.g., SUPERUSER | ADMIN | STAFF
    avatar?: string; // path from db
};


export default function AdminShell({
    user,
    children,
}: React.PropsWithChildren<{ user: AdminUser }>) {
    const [open, setOpen] = useState(false);


    return (
        <div className="min-h-dvh bg-background text-foreground">
            {/* Topbar */}
            <Topbar user={user} onOpenSidebar={() => setOpen(true)} />


            {/* Mobile sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="p-0 w-[300px] sm:w-[340px]">
                    <SidebarNav user={user} onNavigate={() => setOpen(false)} />
                </SheetContent>
            </Sheet>


            {/* Desktop layout */}
            <div className="mx-auto grid max-w-screen-2xl grid-cols-1 lg:grid-cols-[280px_1fr]">
                <aside className={cn(
                    "hidden lg:block border-r",
                    "bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                )}>
                    <SidebarNav user={user} />
                </aside>
                <main className="min-h-[calc(100dvh-3.5rem)] px-3 sm:px-4 lg:px-6 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
}