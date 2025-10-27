import * as React from "react";

export type QuickActionItem = {
    href: string;
    label: string;
    icon?: React.ReactNode;
    src?: string;
    alt?: string;
    newTab?: boolean;
    ariaLabel?: string;
};

export type QuickActionsDockProps = {
    items: QuickActionItem[];
    title?: string;
    subtitle?: string;
    className?: string;
    compact?: boolean;
    id?: string;
};
