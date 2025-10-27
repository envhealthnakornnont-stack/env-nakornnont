import Link from "next/link";
import { CalendarClock, MapPin, Link as LinkIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchIcsEvents, formatRangeTH } from "./utils";
import type { UpcomingProps } from "./types";

export default async function UpcomingFromICS({ icsUrl, limit = 5, className }: UpcomingProps) {
  const now = Date.now();
  const raw = await fetchIcsEvents(icsUrl, 300); // เพิ่มเป็น 5 นาที (หน้าแรก)
  const future = raw
    .filter((e) => (e.end?.getTime() ?? e.start.getTime()) >= now - 24 * 60 * 60 * 1000)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, limit);

  return (
    <Card className={cn("mt-6", className)}>
      <CardHeader>
        <CardTitle className="text-lg">รายการถัดไป</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {future.length === 0 && <p className="text-sm text-muted-foreground">ยังไม่พบกิจกรรมในช่วงใกล้ ๆ นี้</p>}
        {future.map((ev) => (
          <div key={ev.uid ?? `${ev.start.toISOString()}-${ev.summary}`} className="flex items-start gap-3">
            <Badge variant={ev.allDay ? "secondary" : "default"} className="shrink-0">
              {ev.allDay ? "ทั้งวัน" : "ใกล้จะถึง"}
            </Badge>
            <div className="min-w-0">
              <div className="font-medium leading-snug line-clamp-2">{ev.summary ?? "ไม่ระบุหัวข้อ"}</div>
              <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                <CalendarClock className="size-4" />
                {formatRangeTH(ev.start, ev.end, ev.allDay)}
              </div>
              {ev.location && (
                <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-4" />
                  <span className="line-clamp-1">{ev.location}</span>
                </div>
              )}
              {ev.url && (
                <div className="mt-1 text-sm">
                  <Link href={ev.url} target="_blank" className="inline-flex items-center gap-1 underline underline-offset-4">
                    เปิดรายละเอียด <LinkIcon className="size-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
