import UserSettingsComponent from "@/features/admin/components/SettingForm/UserSettings";

export const metadata = {
  title: "ตั้งค่าระบบ | แดชบอร์ดผู้ดูแลระบบ",
  description: "ปรับแต่งการตั้งค่าทั่วไปของบัญชีผู้ใช้งาน เช่น ชื่อจริง นามสกุล และการตั้งค่าความปลอดภัย",
  robots: {
    index: false,
    follow: false,
  },
};

const UserSettingsPage = () => {
  return (
    <UserSettingsComponent/>
  );
};

export default UserSettingsPage;
