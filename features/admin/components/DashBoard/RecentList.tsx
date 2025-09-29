import { CalendarDays, FileText } from "lucide-react";

interface RecentItem {
  type: string;
  title: string;
  date: string;
}

const RecentList = ({ items }: { items: RecentItem[] }) => (
  <div className="card bg-base-100 shadow">
    <div className="card-body">
      <h2 className="card-title">กิจกรรมล่าสุดของคุณ</h2>
      <ul className="divide-y divide-gray-200">
        {items.map((item, idx) => (
          <li key={idx} className="py-3 flex items-start gap-3">
            <div className="pt-1">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-base-content">{item.title}</p>
              <div className="flex items-center text-xs text-base-content/70 mt-1 gap-2">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {item.date}
                </span>
                <span className=" badge badge-ghost badge-sm text-[10px]">{item.type}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default RecentList;
