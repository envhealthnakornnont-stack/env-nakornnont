"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { ShineBorder } from "@/components/ui/shine-border";
import type { EServiceItem } from "./types";

type Props = {
    items: EServiceItem[];
    label?: string;
    subtitle?: string;
    className?: string;
};

export default function ServiceGrid({
    items,
    label = "บริการออนไลน์",
    subtitle,
    className,
}: Props) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", className)}>
            {items.map((it) => (
                <Link
                    key={it.id}
                    href={it.linkURL}
                    target="_blank"
                    rel="noreferrer"
                    className="group focus:outline-none"
                >
                    <MagicCard
                        className={cn(
                            "rounded-3xl p-[2px] bg-transparent shadow-none",
                            "[--m-gradient:radial-gradient(140px_140px_at_var(--m-x)_var(--m-y),theme(colors.fuchsia.300/.35),transparent_60%),radial-gradient(240px_240px_at_var(--m-x)_var(--m-y),theme(colors.sky.300/.25),transparent_60%)]",
                            "motion-reduce:[--m-gradient:transparent]"
                        )}
                    >
                        <Card
                            className={cn(
                                "relative h-full rounded-3xl border-0",
                                "bg-muted/40 shadow-sm",
                                "p-5 sm:p-6 flex flex-col gap-4 sm:gap-5",
                                "transition-all hover:shadow-lg hover:bg-muted/50"
                            )}
                        >
                            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                            <div>
                                <span className="inline-flex items-center rounded-full bg-background text-muted-foreground border px-2.5 py-1 text-[11px] font-medium">
                                    {label}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold leading-snug tracking-tight text-foreground">
                                    {it.title}
                                </h3>
                                {subtitle && (
                                    <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background border transition-transform group-hover:translate-x-1" aria-hidden>
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </div>
                        </Card>
                    </MagicCard>
                </Link>
            ))}
        </div>
    );
}
