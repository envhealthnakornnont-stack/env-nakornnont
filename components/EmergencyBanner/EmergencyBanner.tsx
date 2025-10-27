import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import type { BannerProps } from "./types";
import { cookieKey, shouldHideFromCookie } from "./utils";
import EmergencyBannerClient from "./EmergencyBannerClient";

export default async function EmergencyBanner(props: BannerProps) {
    const {
        id,
        message,
        title,
        href = "/announcements",
        className,
        variant = "emergency",
        sticky = true,
        navbarHeight = 64,
        compact = false,
        persistStorage = "session",
        ttlMs,
        onClose,
        ...rest
    } = props;

    const cookieStore = await cookies();

    let initialOpen = true;
    if (id) {
        const raw = cookieStore.get(cookieKey(id))?.value ?? null;
        if (shouldHideFromCookie(raw, ttlMs)) initialOpen = false;
    }
    if (!initialOpen) return null;

    return (
        <div
            className={cn("z-40 w-full", sticky && "sticky", className)}
            style={{ top: sticky ? navbarHeight : undefined }}
            role={variant === "emergency" ? "alert" : "status"}
            aria-live={variant === "emergency" ? "assertive" : "polite"}
            {...rest}
        >
            <div className="mx-auto max-w-screen-xl px-4">
                <EmergencyBannerClient
                    id={id}
                    initialOpen={initialOpen}
                    message={message}
                    title={title}
                    href={href}
                    variant={variant}
                    compact={compact}
                    persistStorage={persistStorage}
                    ttlMs={ttlMs}
                    className={undefined}
                />
            </div>
        </div>
    );
}