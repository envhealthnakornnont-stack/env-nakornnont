import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CalendarDays, Megaphone, PanelsTopLeft, Newspaper, PartyPopper } from "lucide-react";
import type { QuickActionItem } from "./types";

export function renderIcon(item: QuickActionItem, compact?: boolean) {
    if (item.src) {
        const w = compact ? 28 : 36;
        const h = compact ? 28 : 36;
        return (
            <Image
                src={item.src}
                alt={item.alt ?? item.label}
                width={w}
                height={h}
                className="opacity-90 group-hover:opacity-100"
                loading="lazy"
            />
        );
    }

    if (item.icon && React.isValidElement(item.icon)) {
        type IconEl = React.ReactElement<React.SVGProps<SVGSVGElement>>;
        const forced = cn(
            compact ? "h-6 w-6" : "h-8 w-8",
            "text-foreground opacity-90 group-hover:opacity-100"
        );

        return React.cloneElement(item.icon as IconEl, {
            className: cn(forced, (item.icon as IconEl).props?.className),
            "aria-hidden": true,
        });
    }
    return null;
}

export const PresetIcons = {
    Complaint: <Megaphone />,
    EService: <PanelsTopLeft />,
    News: <Newspaper />,
    Calendar: <CalendarDays />,
    Activity: <PartyPopper />,
} as const;
