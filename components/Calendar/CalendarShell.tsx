// features/users/components/Calendar/CalendarShell.tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, ExternalLink, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ViewMode = "MONTH" | "WEEK" | "AGENDA";

export default function CalendarShell({ calendarId }: { calendarId: string }) {
  const [view, setView] = useState<ViewMode>("MONTH");
  const [loaded, setLoaded] = useState(false);

  const iframeSrc = useMemo(() => {
    const base = "https://calendar.google.com/calendar/embed";
    const params = new URLSearchParams({
      src: calendarId,
      ctz: "Asia/Bangkok",
      hl: "th",
      showTitle: "0",
      showNav: "1",
      showDate: "1",
      showPrint: "0",
      showTabs: "0",
      showCalendars: "0",
      showTz: "0",
      mode: view,
    });
    return `${base}?${params.toString()}`;
  }, [view, calendarId]);

  const openInGoogleUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(calendarId)}`;
  const subscribeUrl = openInGoogleUrl;
  const icsUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;

  return (
    <Card className="border-muted/60">
      <CardHeader className="gap-3">
        <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="size-4" />
          ปฏิทินกิจกรรม (Google Calendar)
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-start">
          <div className="min-w-0">
            <CardTitle className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight truncate">
              สำนักสาธารณสุขและสิ่งแวดล้อม
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              เปลี่ยนมุมมองได้ทันที — เดือน / สัปดาห์ / รายการ — รองรับภาษาไทย
            </CardDescription>
          </div>

          <div className="flex md:justify-end flex-wrap gap-2 [&>*]:shrink-0">
            <Button asChild size="sm" variant="secondary" className="w-full sm:w-auto">
              <Link href={subscribeUrl} target="_blank" rel="noopener">
                <Plus className="mr-2 size-4" />
                ติดตาม Google Calendar
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
              <Link href={icsUrl} target="_blank" rel="noopener">
                ดาวน์โหลด
              </Link>
            </Button>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href={openInGoogleUrl} target="_blank" rel="noopener">
                เปิดเต็มจอ
                <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-1 overflow-x-auto">
          <Tabs value={view} onValueChange={(v) => { setLoaded(false); setView(v as ViewMode); }} className="min-w-auto">
            <TabsList className="flex w-max">
              <TabsTrigger value="MONTH" className="px-4">เดือน</TabsTrigger>
              <TabsTrigger value="WEEK" className="px-4">สัปดาห์</TabsTrigger>
              <TabsTrigger value="AGENDA" className="px-4">รายการ</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="relative w-full rounded-xl border overflow-hidden shadow-sm
                        h-[60vh] min-h-[420px] md:min-h-[520px] lg:min-h-[600px]">
          {!loaded && <div className="absolute inset-0 rounded-xl border bg-muted/40 animate-pulse" />}
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            className={cn("w-full h-full rounded-xl", loaded ? "opacity-100" : "opacity-0")}
            onLoad={() => setLoaded(true)}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          * ปฏิทินนี้ดึงข้อมูลแบบฝังจาก Google Calendar โดยตรง เพื่อความถูกต้องของเวลาและรายละเอียด
        </p>
      </CardContent>
    </Card>
  );
}
