"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

function isActive(pathname: string, href?: string) {
    return href ? pathname === href || pathname.startsWith(href) : false
}

export default function NavMobile() {
    const pathname = usePathname()

    return (
        <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden">
                <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[90vw] sm:w-[380px] p-0 flex h-[100dvh] flex-col overflow-hidden">
                <SheetHeader className="border-b px-4 py-3 shrink-0">
                    <SheetTitle className="flex items-center gap-2 text-left">
                        <Image src="/mobile/mobile-logo.png" alt="logo" width={36} height={36} />
                        <div className="text-sm">
                            <div className="font-semibold">สำนักสาธารณสุขและสิ่งแวดล้อม</div>
                            <div className="text-muted-foreground">เทศบาลนครนนทบุรี</div>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2 overscroll-contain">
                    {/* หมวด: หน้าหลัก (ลิงก์สำคัญ) */}
                    <div className="mb-2 text-xs font-semibold text-muted-foreground">หน้าหลัก</div>
                    <div className="flex flex-col">
                        <Link href="/news/news-updates" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/news/news-updates") ? "bg-accent" : ""}`}>ข่าวประชาสัมพันธ์</Link>
                        <Link href="/news/activities" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/news/activities") ? "bg-accent" : ""}`}>กิจกรรมของสำนัก</Link>
                        <Link href="/public-services" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/public-services") ? "bg-accent" : ""}`}>E‑Service</Link>
                    </div>

                    {/* หมวด: ข้อมูลหน่วยงาน */}
                    <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="about" className="border-b-0">
                            <AccordionTrigger className="px-2 text-sm">ข้อมูลหน่วยงาน</AccordionTrigger>
                            <AccordionContent className="pb-1">
                                <div className="flex flex-col pl-3">
                                    <Link href="/about/personnel/management" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/about/personnel/management") ? "bg-accent" : ""}`}>คณะผู้บริหาร</Link>
                                    <Link href="/about/structure" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/about/structure") ? "bg-accent" : ""}`}>โครงสร้างองค์กร</Link>
                                    <Link href="/about/roles" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/about/roles") ? "bg-accent" : ""}`}>อำนาจหน้าที่</Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* หมวด: หน่วยงานภายใน */}
                    <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value="departments" className="border-b-0">
                            <AccordionTrigger className="px-2 text-sm">หน่วยงานภายใน</AccordionTrigger>
                            <AccordionContent className="pb-1">
                                <div className="flex flex-col pl-3">
                                    <Link href="/departments/general-affairs" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/departments/general-affairs") ? "bg-accent" : ""}`}>ฝ่ายบริหารงานทั่วไป</Link>
                                    <Link href="/departments/public-health-promotion" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/departments/public-health-promotion") ? "bg-accent" : ""}`}>ส่วนส่งเสริมสาธารณสุข</Link>
                                    <Link href="/departments/environmental-health-services" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/departments/environmental-health-services") ? "bg-accent" : ""}`}>ส่วนบริการอนามัยสิ่งแวดล้อม</Link>
                                    <Link href="/departments/environmental-health-promotion" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/departments/environmental-health-promotion") ? "bg-accent" : ""}`}>ส่วนส่งเสริมอนามัยสิ่งแวดล้อม</Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* หมวด: ข้อมูลข่าวสาร */}
                    <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value="news" className="border-b-0">
                            <AccordionTrigger className="px-2 text-sm">ข้อมูลข่าวสาร</AccordionTrigger>
                            <AccordionContent className="pb-1">
                                <div className="flex flex-col pl-3">
                                    <Link href="/news/news-updates" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/news/news-updates") ? "bg-accent" : ""}`}>ข่าวประชาสัมพันธ์</Link>
                                    <Link href="/news/activities" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/news/activities") ? "bg-accent" : ""}`}>กิจกรรมของสำนัก</Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* ติดต่อเรา */}
                    <div className="mt-4 flex flex-col">
                        <Link href="/contact" className={`rounded-md px-2 py-2 text-sm hover:bg-accent ${isActive(pathname, "/contact") ? "bg-accent" : ""}`}>ติดต่อเรา</Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}