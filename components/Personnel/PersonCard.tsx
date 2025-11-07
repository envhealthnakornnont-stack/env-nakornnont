"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { Mail, Phone, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Mgmt } from "./types";

type Item = Mgmt;

export default function PersonCard({ item, highlight = false }: { item: Item; highlight?: boolean }) {
    const roleBadge = item.level === 1 ? "ผอ. สำนัก" : item.level === 2 ? "ผอ. ส่วน" : "หัวหน้าฝ่าย";

    const initials = React.useMemo(() => {
        const parts = item.fullName.split(" ").filter(Boolean);
        const first = parts[0]?.[0] ?? "";
        const last = parts[parts.length - 1]?.[0] ?? "";
        return (first + last).toUpperCase();
    }, [item.fullName]);

    return (
        <Card className={highlight ? "border-primary/40 shadow-sm" : ""} role="article" aria-label={item.fullName}>
            <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-2 ring-primary/20 self-start sm:self-auto">
                        <AvatarImage src={item.imageResolved} alt={item.fullName} className="object-cover object-top" />
                        <AvatarFallback className="text-base sm:text-lg">{initials}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base sm:text-lg font-semibold leading-snug">
                                {item.fullName}
                            </h3>
                            <Badge variant={highlight ? "default" : "secondary"} className="shrink-0">
                                {roleBadge}
                            </Badge>
                            {item.departmentLabel && (
                                <Badge variant="outline" className="hidden sm:inline-flex shrink-0 max-w-[12rem] truncate">
                                    {item.departmentLabel}
                                </Badge>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground leading-snug line-clamp-2">
                            {item.positionName || item.position || "ตำแหน่งไม่ระบุ"}
                        </p>

                        {item.departmentLabel && (
                            <p className="sm:hidden text-xs text-muted-foreground mt-1 truncate">{item.departmentLabel}</p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2 justify-start">
                            {item.email && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button asChild size="sm" variant="outline" className="h-8">
                                                <a href={`mailto:${item.email}`} aria-label={`ติดต่ออีเมล ${item.fullName}`}>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    อีเมล
                                                </a>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{item.email}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {item.phone && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button asChild size="sm" variant="outline" className="h-8">
                                                <a href={`tel:${item.phone}`} aria-label={`โทรหา ${item.fullName}`}>
                                                    <Phone className="mr-2 h-4 w-4" />
                                                    โทร
                                                </a>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{item.phone}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant={highlight ? "default" : "secondary"} className="h-8">
                                        <User className="mr-2 h-4 w-4" />
                                        ดูโปรไฟล์
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle className="leading-tight">{item.fullName}</DialogTitle>
                                        <DialogDescription className="space-y-1">
                                            <span className="block">{item.positionName || item.position}</span>
                                            {item.departmentLabel && <span className="block text-muted-foreground">{item.departmentLabel}</span>}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="mt-4 grid grid-cols-[96px,1fr] sm:grid-cols-[112px,1fr] gap-4">
                                        <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-primary/20">
                                            <AvatarImage src={item.imageResolved} alt={item.fullName} className="object-cover object-top" />
                                            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2 text-sm">
                                            {item.email && (
                                                <div>
                                                    <span className="font-medium">อีเมล: </span>
                                                    <a className="underline underline-offset-2" href={`mailto:${item.email}`}>{item.email}</a>
                                                </div>
                                            )}
                                            {item.phone && (
                                                <div>
                                                    <span className="font-medium">โทร: </span>
                                                    <a className="underline underline-offset-2" href={`tel:${item.phone}`}>{item.phone}</a>
                                                </div>
                                            )}
                                            {item.bio && (
                                                <div className="pt-2">
                                                    <span className="block font-medium">ประวัติย่อ</span>
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {item.bio}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}