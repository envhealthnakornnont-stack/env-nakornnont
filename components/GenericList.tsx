interface DepartmentSectionItem {
    title?: string; // รองรับข้อความหรือตัวเลข
    content?: string | null; // รองรับเนื้อหา Section
    subItems?: DepartmentSectionItem[]; // รองรับ Sub-Section
}

interface DepartmentSectionProps {
    title: string;
    content?: string;
    items?: DepartmentSectionItem[];
}

const GenericList = ({ title, content, items }: DepartmentSectionProps) => {
    // ฟังก์ชันสำหรับแสดงรายการย่อย
    const renderSubItems = (subItems: DepartmentSectionItem[]) => {
        return (
            <ul className="ps-10 py-2">
                {subItems.map((subItem, index) => (
                    <li key={index} className="my-1 list-disc">
                        {subItem.title && <h4 className="text-md font-semibold">{subItem.title}</h4>}
                        {subItem.content && <p className="py-1">{subItem.content}</p>}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="py-3 xl:px-[10%]">
            <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
            {content && <p className="py-2">{content}</p>}
            {items && items.length > 0 ? (
                <ul className="ps-10 py-2">
                    {items.map((item, index) => (
                        <li key={index} className={`my-2 ${!item.subItems && 'list-disc'}`}>
                            {item.title && <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>}
                            {item.content && <p className="py-1">{item.content}</p>}
                            {item.subItems && renderSubItems(item.subItems)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="py-2">ไม่มีข้อมูล</p>
            )}
        </div>
    );
};

// Default props เพื่อป้องกันข้อผิดพลาดในกรณีที่ไม่ได้ส่งค่าบางส่วน
GenericList.defaultProps = {
    content: "",
    items: [],
};

export default GenericList