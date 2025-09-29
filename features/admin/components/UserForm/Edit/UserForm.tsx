"use client";

import InputField from "@/features/admin/components/InputField";

interface UserFormProps {
  userData: {
    firstname: string;
    lastname: string;
    department: string;
    email: string;
    role: string;
  };
  formErrors: { firstname: string; lastname: string; department: string; password: string };
  newPassword: string;
  onChange: (field: string, value: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userData, formErrors, newPassword, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
      <InputField label="ชื่อจริง" name="firstname" placeholder="ชื่อจริง" value={userData.firstname} error={formErrors.firstname} onChange={(e) => onChange("firstname", e.target.value)} />
      <InputField label="นามสกุล" name="lastname" placeholder="นามสกุล" value={userData.lastname} error={formErrors.lastname} onChange={(e) => onChange("lastname", e.target.value)} />
      <InputField label="อีเมล" type="email" name="email" placeholder="example@gmail.com" value={userData.email} disabled={true} />
      <InputField label="รหัสผ่าน" name="password" type="password" placeholder="รหัสผ่านใหม่" value={newPassword} error={formErrors.password} onChange={(e) => onChange("password", e.target.value)} />
      <InputField label="ส่วนงาน" name="department" placeholder="ส่วนงานของคุณ" value={userData.department} error={formErrors.department} onChange={(e) => onChange("department", e.target.value)} />
      <InputField label="ระดับผู้ใช้งาน" name="role" placeholder="ระดับผู้ใช้งาน" value={userData.role} disabled={true} />
    </div>
  );
};

export default UserForm;
