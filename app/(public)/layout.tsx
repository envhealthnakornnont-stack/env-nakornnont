// import components
import Footer from "@/features/users/components/Footer/Footer";
import Drawer from "@/features/users/components/NavbarDrawer/Drawer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const mainMenu = [
    { label: "หน้าแรก", href: "/", isDropdown: false },
    {
      label: "ข้อมูลหน่วยงาน",
      isDropdown: true,
      dropdownItems: [
        {
          label: "บุคลากร",
          isDropdown: true,
          dropdownItems: [
            { label: "ผู้บริหาร", href: "/about/personnel/management" },
          ],
        },
        { label: "โครงสร้างหน่วยงาน", href: "/about/structure" },
        { label: "อำนาจหน้าที่", href: "/about/roles" },
      ],
    },
    {
      label: "หน่วยงานภายใน",
      isDropdown: true,
      dropdownItems: [
        { label: "ฝ่ายบริหารงานทั่วไป", href: "/departments/general-affairs" },
        {
          label: "ส่วนส่งเสริมสาธารณสุข",
          href: "/departments/public-health-promotion",
        },
        {
          label: "ส่วนบริการอนามัยสิ่งแวดล้อม",
          href: "/departments/environmental-health-services",
        },
        {
          label: "ส่วนส่งเสริมอนามัยสิ่งแวดล้อม",
          href: "/departments/environmental-health-promotion",
        },
      ],
    },
    {
      label: "ข้อมูลข่าวสาร",
      isDropdown: true,
      dropdownItems: [
        { label: "ข่าวประชาสัมพันธ์", href: "/news/news-updates" },
        {
          label: "กิจกรรมของสำนัก",
          href: "/news/activities",
        },
      ],
    },
    { label: "E-SERVICE", href: "/public-services", isDropdown: false },
    { label: "ติดต่อเรา", href: "/contact", isDropdown: false },
  ];

  return (
    <>
      <Drawer menu={mainMenu} pathname={"/"} />
      {children}
      <Footer />
    </>
  )
}