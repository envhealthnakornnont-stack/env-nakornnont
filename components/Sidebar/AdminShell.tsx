"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Topbar from "@/components/Sidebar/Topbar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import type { AdminUser } from "@/components/Sidebar/types";
import { PropsWithChildren } from "react";

export default function AdminShell({ user, children }: PropsWithChildren<{ user: AdminUser }>) {
    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <SidebarInset>
                <Topbar user={user} />
                <main className="px-3 sm:px-4 lg:px-6 py-4 min-h-[calc(100dvh-3.5rem)]">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}