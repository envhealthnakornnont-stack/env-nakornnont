"use client";

import useCreateUserForm from "@/features/admin/hooks/UserForm/useCreateUserForm";
import { Pencil, X } from "lucide-react";
import Image from "next/image";
import InputField from "@/features/admin/components/InputField";
import { useRouter } from "next/navigation";
import Alert from "@/features/admin/components/Alert";

const UserCreate = () => {
  const router = useRouter();
  const {
    formData,
    errors,
    loading,
    message,
    setMessage,
    previewUrl,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleAvatarClick,
    handleCancelAvatar,
    handleSubmit,
  } = useCreateUserForm();

  const ImgPath = "/api/uploads"

  return (
    <div className="m-5 p-16 bg-base-100 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Avatar Section */}
        <div className="relative self-center">
          <div className="avatar cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-24 h-24 relative rounded-full overflow-hidden ring-primary ring-offset-base-100 ring ring-offset-2">
              {previewUrl ? (
                <Image
                  src={`${previewUrl}`}
                  alt="Avatar"
                  fill
                  sizes="(max-width: 768px) 100px, 150px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral text-neutral-content">
                  <span className="text-3xl font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>

                  </span>
                </div>
              )}
            </div>
          </div>
          {!previewUrl ? (
            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border border-white hover:bg-primary-focus focus:outline-none tooltip tooltip-bottom"
              data-tip="แก้ไขรูป avatar"
            >
              <Pencil size={16}/>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancelAvatar}
              className="absolute top-0 right-0 bg-error text-white rounded-full p-1 border border-white hover:bg-red-600 focus:outline-none tooltip"
              data-tip="ยกเลิกการเปลี่ยนรูป"
            >
              <X size={16} />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {/* User form for details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          <InputField label="ชื่อจริง" name="firstname" placeholder="ชื่อจริง" value={formData.firstname} error={errors.firstname} onChange={handleChange} />
          <InputField label="นามสกุล" name="lastname" placeholder="นามสกุล" value={formData.lastname} error={errors.lastname} onChange={handleChange} />
          <InputField label="อีเมล" name="email" type="email" placeholder="อีเมล" value={formData.email} error={errors.email} onChange={handleChange} />
          <InputField label="รหัสผ่าน" name="password" type="password" placeholder="รหัสผ่านใหม่" value={formData.password} error={errors.password} onChange={handleChange} />
          <InputField label="ส่วนงาน" name="department" placeholder="แผนกของคุณ" value={formData.department} error={errors.department} onChange={handleChange} />
          <label className="form-control">
            <div className="label">
              <span className="label-text">ระดับผู้ใช้งาน</span>
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="USER">User</option>
              <option value="SUPERUSER">Superuser</option>
            </select>
          </label>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "กำลังดำเนินการ..." : "สร้างผู้ใช้"}
          </button>
          <button type="button" className="btn btn-neutral" onClick={() => router.push("/admin/users")}>
            ยกเลิก
          </button>
        </div>
      </form>
      {message && (
        <Alert
          message={message}
          variant={message === "สร้างผู้ใช้สำเร็จแล้ว" ? "success" : "error"}
          duration={5000}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
};

export default UserCreate;