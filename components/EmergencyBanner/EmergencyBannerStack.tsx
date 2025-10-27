import { cookies } from "next/headers";
import { cookieKey, shouldHideFromCookie } from "./utils";
import type { BannerBase, StorageMode } from "./types";
import EmergencyBanner from "./EmergencyBanner";
import { cn } from "@/lib/utils";

export default async function EmergencyBannerStack({
    items,
    sticky = true,
    navbarHeight = 64,
    persistStorage = "session",
    className,
    max = 3,
}: {
    items: BannerBase[];
    sticky?: boolean;
    navbarHeight?: number;
    persistStorage?: StorageMode;
    className?: string;
    max?: number;
}) {
    // ✅ Next 15: await dynamic API
    const cookieStore = await cookies();

    const filtered = items.filter((b) => {
        const raw = cookieStore.get(cookieKey(b.id))?.value ?? null;
        return !shouldHideFromCookie(raw, b.ttlMs);
    });

    if (filtered.length === 0) return null;

    const show = filtered.slice(0, max);

    return (
        <div className={cn("z-40 w-full", sticky && "sticky", className)} style={{ top: sticky ? navbarHeight : undefined }}>
            <div className="mx-auto max-w-screen-xl px-4 space-y-2">
                {show.map((b, idx) => (
                    <EmergencyBanner
                        key={b.id}
                        id={b.id}
                        title={b.title}
                        message={b.message}
                        href={b.href}
                        variant={b.variant ?? "emergency"}
                        compact={b.compact}
                        sticky={false}
                        navbarHeight={navbarHeight}
                        persistStorage={persistStorage}
                        ttlMs={b.ttlMs}
                        aria-live={idx === 0 && (b.variant ?? "emergency") === "emergency" ? "assertive" : "polite"}
                    />
                ))}
            </div>
        </div>
    );
}