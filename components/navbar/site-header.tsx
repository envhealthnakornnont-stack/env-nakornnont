"use client"

import Link from "next/link"
import Image from "next/image"
import NavMobile from "@/components/navbar/nav-mobile"
import { NavigationMenuNakornnont } from "@/components/navbar/navigation-menu"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-3 md:px-4">
                {/* Left: Mobile + Logo */}
                <div className="flex items-center gap-2">
                    <NavMobile />
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/mobile/mobile-logo.png" alt="nakornnont logo" width={40} height={40} />
                        <div className="flex flex-col leading-tight">
                            <span className="text-[12px] sm:text-sm font-semibold">สำนักสาธารณสุขและสิ่งแวดล้อม</span>
                            <span className="text-[11px] text-muted-foreground">เทศบาลนครนนทบุรี</span>
                        </div>
                    </Link>
                </div>

                {/* Center: Desktop menu */}
                <div className="hidden lg:block">
                    <NavigationMenuNakornnont />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 mx-2">
                    <AnimatedThemeToggler />
                </div>
            </div>
        </header>
    )
}