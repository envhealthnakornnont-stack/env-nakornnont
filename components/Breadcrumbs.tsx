import Link from "next/link";

interface BreadcrumbItem {
    label?: string;
    href?: string; // ใช้เป็น `undefined` หากไม่ต้องการให้ลิงก์ได้
    isCurrent?: boolean; // ระบุว่าเป็นหน้าปัจจุบัน
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <div className="breadcrumbs text-sm">
            <ul>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={
                            item.isCurrent
                                ? "opacity-100" // สไตล์สำหรับหน้าปัจจุบัน
                                : "opacity-65 hover:opacity-100"
                        }
                    >
                        {item.href && !item.isCurrent ? (
                            <Link href={item.href}>{item.label}</Link>
                        ) : (
                            item.label // แสดงข้อความธรรมดาสำหรับหน้าปัจจุบัน
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
