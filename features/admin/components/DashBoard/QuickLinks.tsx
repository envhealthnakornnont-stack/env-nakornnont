import { PlusCircle, FolderOpen } from "lucide-react";

const QuickLinks = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    {[
      {
        href: "/admin/news/news-update/create",
        icon: <PlusCircle className="w-6 h-6" />,
        label: "สร้างข่าว",
        btnClass: "bg-primary text-primary-content hover:bg-primary/80",
      },
      {
        href: "/admin/news/activities/create",
        icon: <PlusCircle className="w-6 h-6" />,
        label: "สร้างกิจกรรม",
        btnClass: "bg-secondary text-secondary-content hover:bg-secondary/80",
      },
      {
        href: "/admin/news/news-update",
        icon: <FolderOpen className="w-6 h-6" />,
        label: "ข่าวของฉัน",
        btnClass: "bg-base-200 text-base-content hover:bg-base-300",
      },
      {
        href: "/admin/news/activities",
        icon: <FolderOpen className="w-6 h-6" />,
        label: "กิจกรรมของฉัน",
        btnClass: "bg-base-200 text-base-content hover:bg-base-300",
      },
    ].map((item, idx) => (
      <a
        key={idx}
        href={item.href}
        className={`flex flex-col items-center justify-center rounded-lg p-4 shadow transition-all duration-200 ${item.btnClass}`}
      >
        {item.icon}
        <span className="mt-2 text-sm font-medium">{item.label}</span>
      </a>
    ))}
  </div>
);

export default QuickLinks;