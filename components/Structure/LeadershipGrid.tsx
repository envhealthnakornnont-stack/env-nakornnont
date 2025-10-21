"use client";

import * as React from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Leader = {
    id: string;
    name: string;
    role: string;
    unit?: string;
    email?: string;
    phone?: string;
    photo?: string;
};

export default function LeadershipGrid({ leaders }: { leaders: Leader[] }) {
  return (
    <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {leaders.map((p) => (
        <li key={p.id}>
          <Card className="h-full overflow-hidden">
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border sm:h-16 sm:w-16 xl:h-20 xl:w-20">
                {p.photo ? (
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    sizes="(min-width:1280px) 80px, (min-width:640px) 64px, 56px"
                    className="object-cover"
                  />
                ) : (
                  <div className={cn("grid h-full w-full place-items-center bg-muted text-muted-foreground text-lg font-semibold")}>{p.name?.charAt(0) ?? "•"}</div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="truncate font-medium leading-tight" title={p.name}>{p.name}</span>
                </div>
                <div className="text-sm text-muted-foreground text-center" title={p.role}>{p.role}</div>

                <div className="mt-2 flex flex-col items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="inline-flex max-w-full items-center gap-1 hover:underline break-words"
                      aria-label={`อีเมล ${p.name}`}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate" title={p.email}>{p.email}</span>
                    </a>
                  )}
                  {p.phone && (
                    <a
                      href={`tel:${p.phone}`}
                      className="inline-flex max-w-full items-center gap-1 hover:underline break-words"
                      aria-label={`โทรศัพท์ ${p.name}`}
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate" title={p.phone}>{p.phone}</span>
                    </a>
                  )}
                  {p.unit && <Badge variant="outline" className="text-[10px]">{p.unit}</Badge>}
                </div>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}