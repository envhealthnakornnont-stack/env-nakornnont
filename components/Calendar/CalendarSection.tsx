import { cn } from "@/lib/utils";
import CalendarShell from "./CalendarShell";
import UpcomingFromICS from "./UpcomingFromICS";

const CAL_ID =
  "cfdfc2cda5b0b59598619d15770531f5604bd8f2e9bb8269e063c06b9ea41fac@group.calendar.google.com";

export default function CalendarSection() {
  const icsUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CAL_ID)}/public/basic.ics`;

  return (
    <section id="calendar" className={cn("w-full mx-auto px-4 sm:px-6", "py-4 sm:py-8", "max-w-screen-xl", "scroll-mt-28 md:scroll-mt-32")}>
      <CalendarShell calendarId={CAL_ID} />
      <UpcomingFromICS icsUrl={icsUrl} limit={5} />
    </section>
  );
}
