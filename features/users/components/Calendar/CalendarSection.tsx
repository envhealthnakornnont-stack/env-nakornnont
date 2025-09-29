import { calendarIcon } from "@/config/iconConfig";

const CalendarSection = () => {
    return (
        <div className="flex flex-col gap-6 items-center py-5 xl:py-10 px-10 xl:px-20">
            <h1 className="sm:text-3xl text-2xl font-bold inline-flex items-center justify-center gap-1">
                <span className="pe-2">{calendarIcon()}</span>
                ปฏิทินกิจกรรม
            </h1>
            <div className="w-full sm:aspect-[4/3] aspect-square"> {/* Mobile = 1:1, Tablet+ = 4:3 */}
                <iframe
                    className="w-full h-full border rounded-lg"
                    src="https://calendar.google.com/calendar/embed?src=cfdfc2cda5b0b59598619d15770531f5604bd8f2e9bb8269e063c06b9ea41fac%40group.calendar.google.com&ctz=Asia%2FBangkok"
                ></iframe>
            </div>
        </div>
    )
}

export default CalendarSection;
