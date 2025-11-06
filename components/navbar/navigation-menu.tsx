"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Megaphone, Newspaper, Building2, BadgeCheck } from "lucide-react"
import { RetroGrid } from "@/components/ui/retro-grid"
import { cn } from "@/lib/utils"
import Image from "next/image"

function useIsActive() {
    const pathname = usePathname()
    return (href?: string) => (href ? pathname === href || pathname.startsWith(href) : false)
}

function TileItem({
    title,
    children,
    href,
    icon,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & {
    href: string
    icon?: React.ReactNode
}) {
    return (
        <li {...props} className="list-none">
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="group block rounded-xl border bg-background p-3 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <div className="flex items-start gap-3">
                        {icon ? <div className="mt-0.5 shrink-0 rounded-md border p-1.5">{icon}</div> : null}
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                                <div className="text-sm font-semibold leading-none">{title}</div>
                            </div>
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">{children}</p>
                        </div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}

function TextLinkItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props} className="list-none">
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="group block rounded-xl border bg-background p-3 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <div className="flex-1">
                        <div className="text-sm font-semibold leading-none">{title}</div>
                        <div className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">{children}</div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}

function BrandCard() {
    return (
        <NavigationMenuLink asChild>
            <Link
                href="/"
                className="
                relative block h-full overflow-hidden
                rounded-xl border no-underline shadow-sm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                bg-background
                "
            >
                {/* พื้นหลัง Retro Grid — แสดงเต็มใบ */}
                <RetroGrid
                    
                />

                {/* เนื้อหา */}
                <div className="relative p-6 z-10 flex h-full flex-col items-center text-center">
                    {/* โลโก้กึ่งกลางด้านบน */}
                    <div className="flex-1" />
                    <Image
                        src="/mobile/mobile-logo.png"
                        alt="โลโก้ เทศบาลนครนนทบุรี"
                        width={84}
                        height={84}
                        priority
                    />
                    {/* ชื่อ/คำบรรยาย */}
                    <div className="mt-3">
                        <div className="text-base font-bold">สำนักสาธารณสุขและสิ่งแวดล้อม</div>
                        <p className="text-muted-foreground mt-1 text-sm leading-tight">
                            เทศบาลนครนนทบุรี — รวมบริการ ข่าวสาร และข้อมูลหน่วยงานในที่เดียว
                        </p>
                    </div>

                    {/* ดันพื้นที่ให้การ์ดเต็มความสูง */}
                </div>
            </Link>
        </NavigationMenuLink>
    )
}

export function NavigationMenuNakornnont() {
    // const isActive = useIsActive()

    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                {/* หน้าหลัก */}
                <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="rounded-full px-3 py-2 text-sm font-medium">หน้าหลัก</NavigationMenuTrigger>
                    <NavigationMenuContent className="z-50 rounded-xl border bg-popover p-2 shadow-md md:left-1/2 md:-translate-x-1/2 xl:left-0 xl:translate-x-0 mt-1">
                        <ul className="grid gap-2 p-3 w-[calc(100vw-2rem)] max-w-[720px] md:grid-cols-[.9fr_1fr] md:[grid-auto-rows:minmax(0,1fr)]">
                            <li className="md:row-span-3"><BrandCard /></li>
                            <TileItem href="/news/news-updates" title="ข่าวประชาสัมพันธ์" icon={<Newspaper className="h-4 w-4" />}>อัปเดตข่าวจากสำนักฯ ประกาศสำคัญ และสาระน่ารู้ด้านสาธารณสุข</TileItem>
                            <TileItem href="/news/activities" title="กิจกรรมของสำนัก" icon={<BadgeCheck className="h-4 w-4" />}>ติดตามกิจกรรม โครงการ และภาพบรรยากาศการทำงานร่วมกับชุมชน</TileItem>
                            <TileItem href="/public-services" title="E‑Service" icon={<Megaphone className="h-4 w-4" />}>ยื่นคำร้อง ขอเอกสาร และบริการออนไลน์ต่าง ๆ ได้ตลอดเวลา</TileItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* ข้อมูลหน่วยงาน */}
                <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="rounded-full px-3 py-2 text-sm font-medium">ข้อมูลหน่วยงาน</NavigationMenuTrigger>
                    <NavigationMenuContent className="z-50 rounded-xl border bg-popover p-2 shadow-md md:left-1/2 md:-translate-x-1/2 xl:left-0 xl:translate-x-0 mt-1">
                        <ul className="p-3 space-y-2 w-[calc(100vw-2rem)] max-w-[360px] ax-h-[70vh] overflow-auto">
                            <TextLinkItem href="/about/personnel/management" title="คณะผู้บริหาร">ทำความรู้จักผู้บริหาร วิสัยทัศน์ และพันธกิจหลักของสำนักฯ</TextLinkItem>
                            <TextLinkItem href="/about/structure" title="โครงสร้างองค์กร">แผนผังการแบ่งส่วนราชการ หน่วยงาน และสายงานที่รับผิดชอบ</TextLinkItem>
                            <TextLinkItem href="/about/roles" title="อำนาจหน้าที่">ขอบเขตหน้าที่ กฎหมาย ระเบียบ และบริการภารกิจของสำนักฯ</TextLinkItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* หน่วยงานภายใน */}
                <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="rounded-full px-3 py-2 text-sm font-medium">หน่วยงานภายใน</NavigationMenuTrigger>
                    <NavigationMenuContent className="z-50 rounded-xl border bg-popover p-2 shadow-md md:left-1/2 md:-translate-x-1/2 2xl:left-0 2xl:translate-x-0 mt-1">
                        <ul className="grid gap-2 p-3 w-[calc(100vw-2rem)] max-w-[720px] grid-cols-1 md:grid-cols-2 max-h-[70vh] overflow-auto">
                            <TileItem href="/departments/general-affairs" title="ฝ่ายบริหารงานทั่วไป" icon={<Building2 className="h-4 w-4" />}>งานธุรการ การเงิน พัสดุ และงานอำนวยการสนับสนุนภารกิจหลัก</TileItem>
                            <TileItem href="/departments/public-health-promotion" title="ส่วนส่งเสริมสาธารณสุข" icon={<Building2 className="h-4 w-4" />}>ส่งเสริมสุขภาพ ป้องกันโรค และสร้างเสริมศักยภาพชุมชน</TileItem>
                            <TileItem href="/departments/environmental-health-services" title="ส่วนบริการอนามัยสิ่งแวดล้อม" icon={<Building2 className="h-4 w-4" />}>บริการตรวจสอบ ควบคุม และจัดการด้านสิ่งแวดล้อม</TileItem>
                            <TileItem href="/departments/environmental-health-promotion" title="ส่วนส่งเสริมอนามัยสิ่งแวดล้อม" icon={<Building2 className="h-4 w-4" />}>รณรงค์ความสะอาด คุณภาพอากาศ น้ำเสีย ขยะ และสิ่งแวดล้อมเมือง</TileItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* ข้อมูลข่าวสาร */}
                <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="rounded-full px-3 py-2 text-sm font-medium">ข้อมูลข่าวสาร</NavigationMenuTrigger>
                    <NavigationMenuContent className="z-50 rounded-xl border bg-popover p-2 shadow-md md:left-1/2 md:-translate-x-1/2 xl:left-0 xl:translate-x-0 mt-1">
                        <ul className="p-3 space-y-2 w-[calc(100vw-2rem)] max-w-[360px] ax-h-[70vh] overflow-auto">
                            <TextLinkItem href="/news/news-updates" title="ข่าวประชาสัมพันธ์">รวมข่าว แจ้งเตือน ประกาศ และข้อมูลที่ประชาชนควรทราบ</TextLinkItem>
                            <TextLinkItem href="/news/activities" title="กิจกรรมของสำนัก">ปฏิทินกิจกรรม รูปภาพ และรายงานสรุปกิจกรรมที่ผ่านมา</TextLinkItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* ติดต่อเรา */}
                <NavigationMenuItem className="relative">
                    <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "rounded-full px-3 py-2")}>
                        <Link href="/contact" className="text-sm font-medium">ติดต่อเรา</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}