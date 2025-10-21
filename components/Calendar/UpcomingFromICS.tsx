import { CalendarClock, MapPin, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  icsUrl: string;     // ลิงก์ .ics สาธารณะของปฏิทิน
  limit?: number;     // จำนวนรายการ (ดีฟอลต์ 5)
  className?: string;
};

type VEvent = {
  uid?: string;
  summary?: string;
  description?: string;
  location?: string;
  url?: string;
  start: Date;
  end?: Date;
  allDay: boolean;
};

const TZ = "Asia/Bangkok";

// แปลงสตริงวันที่จาก ICS -> Date (รองรับ YYYYMMDD และ YYYYMMDDTHHMMSSZ/ท้องถิ่น)
function parseIcsDate(s: string | undefined): { date?: Date; allDay: boolean } {
  if (!s) return { allDay: false };
  // ตัด ;VALUE=DATE หรือ ;TZID= ออก
  const [dtRaw] = s.split(";");
  const val = dtRaw.replace(/^DTSTART:|^DTEND:|^DUE:|^DTSTAMP:/, "");
  const isDateOnly = /^\d{8}$/.test(val);
  if (isDateOnly) {
    // interpret เป็น all-day ในโซนเวลาไทย
    const y = Number(val.slice(0, 4));
    const m = Number(val.slice(4, 6)) - 1;
    const d = Number(val.slice(6, 8));
    return { date: new Date(Date.UTC(y, m, d, 0, 0, 0)), allDay: true };
  }
  // มีเวลา อาจลงท้าย Z (UTC) หรือไม่มี (ถือเป็น local แล้วให้ปรับเป็นไทย)
  const isoLike =
    val.length === 15 && val.endsWith("Z")
      ? `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}T${val.slice(9, 11)}:${val.slice(11, 13)}:${val.slice(13, 15)}Z`
      : `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}T${val.slice(9, 11)}:${val.slice(11, 13)}:${val.slice(13, 15)}`;

  const date = new Date(isoLike);
  return { date, allDay: false };
}

// พาร์เซ ICS แบบเบา ๆ
async function fetchEvents(icsUrl: string): Promise<VEvent[]> {
  const res = await fetch(icsUrl, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const text = await res.text();

  const blocks = text.split("BEGIN:VEVENT").slice(1);
  const events: VEvent[] = [];

  for (const b of blocks) {
    const section = b.split("END:VEVENT")[0];

    const get = (key: string) => {
      const m = section.match(new RegExp(`${key}(:|;[^\\n]*:)\\s*(.+)`, "i"));
      return m ? m[2].trim().replace(/\\n/g, "\n").replace(/\\,/g, ",") : undefined;
    };

    const dtStartLine = section.match(/DTSTART[^\n]*/)?.[0];
    const dtEndLine = section.match(/DTEND[^\n]*/)?.[0];

    const { date: start, allDay } = parseIcsDate(dtStartLine);
    const { date: end } = parseIcsDate(dtEndLine);

    if (!start) continue;

    events.push({
      uid: get("UID"),
      summary: get("SUMMARY"),
      description: get("DESCRIPTION"),
      location: get("LOCATION"),
      url: get("URL"),
      start,
      end,
      allDay,
    });
  }
  return events;
}

// ฟอร์แมตวันที่/เวลาแบบไทย
function formatRange(start: Date, end: Date | undefined, allDay: boolean) {
  const dFmt = new Intl.DateTimeFormat("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  });
  const tFmt = new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  });

  if (allDay) {
    if (end && end.getTime() - start.getTime() > 24 * 60 * 60 * 1000) {
      // กรณีหลายวัน (DTEND มักเป็นวันสิ้นสุด +1)
      const endMinus1 = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      return `${dFmt.format(start)} – ${dFmt.format(endMinus1)} (ทั้งวัน)`;
    }
    return `${dFmt.format(start)} (ทั้งวัน)`;
  }

  if (end) {
    const sameDay =
      new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }).format(start) ===
      new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }).format(end);
    if (sameDay) {
      return `${dFmt.format(start)} · ${tFmt.format(start)}–${tFmt.format(end)}`;
    }
    return `${dFmt.format(start)} ${tFmt.format(start)} – ${dFmt.format(end)}`;
  }

  return `${dFmt.format(start)} · ${tFmt.format(start)}`;
}

export default async function UpcomingFromICS({ icsUrl, limit = 5, className }: Props) {
  const now = Date.now();

  const raw = await fetchEvents(icsUrl);
  const future = raw
    .filter((e) => (e.end?.getTime() ?? e.start.getTime()) >= now - 24 * 60 * 60 * 1000) // เผื่อกรณีเพิ่งเริ่มไม่นาน
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, limit);

  return (
    <Card className={cn("mt-6", className)}>
      <CardHeader>
        <CardTitle className="text-lg">รายการถัดไป</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {future.length === 0 && (
          <p className="text-sm text-muted-foreground">ยังไม่พบกิจกรรมในช่วงใกล้ ๆ นี้</p>
        )}

        {future.map((ev) => (
          <div key={ev.uid ?? `${ev.start.toISOString()}-${ev.summary}`} className="flex items-start gap-3">
            <Badge variant={ev.allDay ? "secondary" : "default"} className="shrink-0">
              {ev.allDay ? "ทั้งวัน" : "ใกล้จะถึง"}
            </Badge>
            <div className="min-w-0">
              <div className="font-medium leading-snug line-clamp-2">{ev.summary ?? "ไม่ระบุหัวข้อ"}</div>
              <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                <CalendarClock className="size-4" />
                {formatRange(ev.start, ev.end, ev.allDay)}
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
