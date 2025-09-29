// import Next Components
import Link from "next/link";
import Image from "next/image";

// import component
import NavbarMenuItem from "./NavbarMenuItem";
import NavbarDrawerButton from "./NavbarDrawerButton";
import Dropdown from "@/components/Dropdown";
import Theme from "@/components/Theme";

interface NavbarProps {
  menu: { label: string; href?: string; isDropdown?: boolean; dropdownItems?: any[] }[],
  pathname: boolean
}

const Navbar: React.FC<NavbarProps> = ({ menu, pathname }) => {

  return (
    <div className={`navbar bg-base-100 ${pathname ? "justify-end" : ""} w-full bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] shadow-sm`}>
      {!pathname && <div className="mx-2 flex-1 md:px-2">
        <Link href={`/`} className="flex items-center gap-2 px-0 font-bold">
          <Image
            src="/mobile/mobile-logo.png"
            width={48}
            height={48}
            alt="nakornnont logo"
            className="object-contain"
          />
          <div className="text-start text-xs md:text-sm xl:text-base">
            <p>สำนักสาธารณสุขและสิ่งแวดล้อม</p>
            <p>เทศบาลนครนนทบุรี</p>
          </div>
        </Link>
      </div>}
      {!pathname && <div className="hidden flex-none lg:block">
        <ul className="menu menu-horizontal items-center xl:textarea-md">
          {/* Navbar menu content here */}
          {menu.map((item, index) =>
            item.isDropdown && item.dropdownItems ? (
              <Dropdown
                key={index}
                label={item.label}
                items={item.dropdownItems}
              />
            ) : (
              <NavbarMenuItem key={index} href={item.href} label={item.label} />
            )
          )}
        </ul>
      </div>}
      <Theme />
      <NavbarDrawerButton />
    </div>
  );
};

export default Navbar;
