import SideMenu from "@/features/admin/components/NavbarDrawer/SideMenu";

const Sidebar = async () => {

    return (
        <div className="drawer-side" style={{ zIndex: 200 }}>
            <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
            ></label>
            {/* Sidebar content here */}
            <SideMenu />
        </div>
    )
}

export default Sidebar