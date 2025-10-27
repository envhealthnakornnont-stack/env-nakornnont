import * as React from "react";
import { cn } from "@/lib/utils";
import { CalendarDays, Megaphone, PanelsTopLeft, Newspaper, PartyPopper } from "lucide-react";
import type { QuickActionItem } from "./types";

export function renderIcon(item: QuickActionItem, compact?: boolean) {
    if (item.src) {
        return (
            <img
                src={item.src}
                alt={item.alt ?? item.label}
                width={compact ? 28 : 36}
                height={compact ? 28 : 36}
                className="opacity-90 group-hover:opacity-100"
                loading="lazy"
                decoding="async"
            />
        );
    }

    if (item.icon && React.isValidElement(item.icon)) {
        const forced = cn(compact ? "h-6 w-6" : "h-8 w-8", "text-foreground opacity-90 group-hover:opacity-100");
        return React.cloneElement(item.icon as React.ReactElement<any>, {
            className: cn(forced, (item.icon as React.ReactElement<any>).props?.className),
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
};
