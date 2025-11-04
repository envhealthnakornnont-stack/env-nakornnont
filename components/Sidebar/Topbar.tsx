
"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2 as Spinner, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getPageTitle } from "@/components/Sidebar/PageTitle";
import UserMenu from "@/components/Sidebar//UserMenu";
import type { AdminUser } from "@/components/Sidebar/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useEffect, useRef, useState, useTransition } from "react";

function useDebounced<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

export default function Topbar({ user }: { user: AdminUser }) {
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    const searchParams = useSearchParams();
    const initialQ = searchParams.get('q') ?? '';

    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [q, setQ] = useState(initialQ);
    const [isComposing, setIsComposing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const debounced = useDebounced(q, 300);

    // sync เมื่อ URL ถูกเปลี่ยนจากภายนอก (เช่นกด Back/Forward)
    useEffect(() => {
        const urlQ = searchParams.get('q') ?? '';
        setQ(urlQ);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // live replace เมื่อพิมพ์ (หลัง debounce และไม่ composing)
    useEffect(() => {
        if (isComposing) return;

        const term = debounced.trim();
        const url = term.length >= 2 ? `/admin/search?q=${encodeURIComponent(term)}` : `/admin/search`;

        startTransition(() => {
            router.replace(url, { scroll: false });
        });
    }, [debounced, isComposing, router]);

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const term = q.trim();
            const url = term.length >= 2 ? `/admin/search?q=${encodeURIComponent(term)}` : `/admin/search`;
            router.push(url); // commit ลง history
        }
        if (e.key === 'Escape') {
            setQ('');
            startTransition(() => {
                router.replace('/admin/search', { scroll: false });
            });
            inputRef.current?.blur();
        }
        // ปุ่มลัด: "/" โฟกัสช่อง (เว้นเมื่อโฟกัสอยู่แล้ว)
        if (e.key === '/' && e.currentTarget !== document.activeElement) {
            e.preventDefault();
            inputRef.current?.focus();
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-2 sm:px-4">
                <SidebarTrigger className="-ml-1" />
                <h1 className="line-clamp-1 text-base font-semibold sm:text-lg lg:text-xl">{title}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                            <Input
                                ref={inputRef}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={onKeyDown}
                                onCompositionStart={() => setIsComposing(true)}
                                onCompositionEnd={() => setIsComposing(false)}
                                className="pl-8 w-[200px] lg:w-[260px] pr-8"
                                placeholder="ค้นหาในระบบ..."
                                aria-label="ค้นหาในระบบ"
                                inputMode="search"
                            />
                            {(isPending || q !== debounced) && (
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-2 flex items-center"
                                    role="status"
                                    aria-live="polite"
                                >
                                    <Spinner className="h-4 w-4 animate-spin opacity-70" />
                                </div>
                            )}
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