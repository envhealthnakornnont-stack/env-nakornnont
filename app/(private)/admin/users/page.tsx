import ManagementPage from '@/features/admin/components/Management/ManagementPage';

export const metadata = {
  title: "จัดการระบบผู้ใช้งาน | แดชบอร์ดผู้ดูแลระบบ",
  description: "ดูและบริหารจัดการบัญชีผู้ใช้ในระบบทั้งหมด",
  robots: {
    index: false,
    follow: false,
  },
};

const UsersPage = () => {
  return (
    <ManagementPage
      getsApi="/api/users"
      createLink="/admin/users/create"
      editLink="/admin/users/edit/"
      deleteApi="/api/users/delete/"
    />
  );
}

export default UsersPage;