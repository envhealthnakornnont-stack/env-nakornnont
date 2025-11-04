"use client";

import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User2 } from "lucide-react";
import type { AdminUser } from "./AdminShell";

export default function UserMenu({ user }: { user: AdminUser }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-7 w-7 overflow-hidden rounded-full bg-muted">
                        {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.avatar.startsWith("blob:") || user.avatar.startsWith("data:") ? user.avatar : `/api/uploads${user.avatar}`}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="grid h-full w-full place-items-center text-[10px] opacity-70">
                                {user.email?.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <span className="hidden sm:inline-block text-sm">{user.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <a href="/admin/account" className="flex items-center gap-2">
                            <User2 className="h-4 w-4" />
                            โปรไฟล์ & การตั้งค่า
                        </a>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        import("next-auth/react").then(({ signOut }) =>
                            signOut({ callbackUrl: "/auth/secure/gateway/login" })
                        )
                    }
                    className="text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}