import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import ImageLogin from "@/features/admin/components/Login/ImageLogin";
import FormLogin from "@/features/admin/components/Login/FormLogin";
import LoginForm from "@/components/Login/LoginForm";
import LoginAside from "@/components/Login/LoginAside";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/admin/dashboard");

  return (
    <div className="relative min-h-svh bg-background">
      {/* แพทเทิร์นพื้นหลังเบา ๆ รองรับดาร์กโหมด */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.08] dark:opacity-[0.12] [mask-image:radial-gradient(50%_50%_at_50%_50%,#000_50%,transparent_100%)]"
        style={{
          backgroundImage:
            "linear-gradient(#8882 1px,transparent 1px),linear-gradient(90deg,#8882 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative grid min-h-svh grid-cols-1 md:grid-cols-2">
        {/* Aside (ภาพ/แบรนดิ้ง/ข้อความ) */}
        <LoginAside />

        {/* Form */}
        <div className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}