// import components

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DrawerProps {
    menu: { label: string; href?: string; isDropdown?: boolean; dropdownItems?: any[] }[];
    pathname: string;
}

const Drawer: React.FC<DrawerProps> = ({ menu, pathname }) => {
    const isAdmin = pathname.startsWith("/admin");
    const drawerClass = isAdmin ? "lg:drawer-open" : ""

    return (
        <div className={`drawer ${drawerClass} sticky top-0`} style={{ zIndex: 100 }}>
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <Navbar menu={menu} pathname={isAdmin} />
                {/* Page content here */}
            </div>
            <div className="drawer-side">
                <label
                    htmlFor="my-drawer-3"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                {/* Sidebar content here */}
                <Sidebar menu={menu} />
            </div>
        </div>
    )
}

export default Drawer