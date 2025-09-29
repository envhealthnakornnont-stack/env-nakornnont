"use client";
// import Next Components
import Link from "next/link";
import Image from "next/image";

interface MenuItem {
  label: string;
  href?: string;
  isDropdown?: boolean;
  dropdownItems?: MenuItem[];
}

interface SidebarProps {
  menu: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menu }) => {
  const closeSidebar = () => document.getElementById("my-drawer-3")?.click();

  // Recursive function สำหรับ Render เมนู Dropdown
  const renderMenu = (items: MenuItem[]) => (
    <ul className="flex flex-col gap-3 my-2">
      {items.map((item, index) =>
        item.isDropdown && item.dropdownItems ? (
          <li key={index}>
            <details>
              <summary>{item.label}</summary>
              {renderMenu(item.dropdownItems)} {/* Render Dropdown ซ้อน */}
            </details>
          </li>
        ) : (
          <li key={index}>
            <Link
              href={item.href || "#"}
              onClick={() => {
                closeSidebar();
              }}
              className="hover:bg-base-300"
            >
              {item.label}
            </Link>
          </li>
        )
      )}
    </ul>
  );

  return (
    <ul className="menu justify-between bg-base-200 min-h-full w-80 p-4">
      {renderMenu(menu)} {/* เรียกใช้ Recursive Function */}
      <div className="flex flex-col gap-2 items-center my-2">
        <Image src={`/mobile/mobile-logo.png`} alt="nakornnont logo" width={60} height={60} />
        <div className="text-center font-bold text-sm md:text-sm xl:text-base">
          <p>สำนักสาธารณสุขและสิ่งแวดล้อม</p>
          <p>เทศบาลนครนนทบุรี</p>
        </div>
      </div>
    </ul>
  );
};

export default Sidebar;
