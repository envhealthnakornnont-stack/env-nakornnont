import type { VEvent } from "./types";

export const TZ = "Asia/Bangkok";

// แปลงสตริงวันที่จาก ICS -> Date
export function parseIcsDate(s: string | undefined): { date?: Date; allDay: boolean } {
    if (!s) return { allDay: false };
    const [dtRaw] = s.split(";");
    const val = dtRaw.replace(/^DTSTART:|^DTEND:|^DUE:|^DTSTAMP:/, "");
    const isDateOnly = /^\d{8}$/.test(val);
    if (isDateOnly) {
        const y = Number(val.slice(0, 4));
        const m = Number(val.slice(4, 6)) - 1;
        const d = Number(val.slice(6, 8));
        return { date: new Date(Date.UTC(y, m, d, 0, 0, 0)), allDay: true };
    }
    const isoLike =
        val.length === 15 && val.endsWith("Z")
            ? `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}T${val.slice(9, 11)}:${val.slice(11, 13)}:${val.slice(13, 15)}Z`
            : `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}T${val.slice(9, 11)}:${val.slice(11, 13)}:${val.slice(13, 15)}`;
    return { date: new Date(isoLike), allDay: false };
}

// พาร์เซ ICS แบบเบา ๆ + แคช 60 วิ (ฝั่งเซิร์ฟเวอร์)
export async function fetchIcsEvents(icsUrl: string, revalidateSec = 60): Promise<VEvent[]> {
    const res = await fetch(icsUrl, { next: { revalidate: revalidateSec } });
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

// ฟอร์แมตช่วงวันเวลาแบบไทย
export function formatRangeTH(start: Date, end: Date | undefined, allDay: boolean) {
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
            const endMinus1 = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            return `${dFmt.format(start)} – ${dFmt.format(endMinus1)} (ทั้งวัน)`;
        }
        return `${dFmt.format(start)} (ทั้งวัน)`;
    }

    if (end) {
        const sameDay =
            new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }).format(start) ===
            new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }).format(end);
        if (sameDay) return `${dFmt.format(start)} · ${tFmt.format(start)}–${tFmt.format(end)}`;
        return `${dFmt.format(start)} ${tFmt.format(start)} – ${dFmt.format(end)}`;
    }

    return `${dFmt.format(start)} · ${tFmt.format(start)}`;
}