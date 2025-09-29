import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Dashboard from "@/features/admin/components/DashBoard/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role: "SUPERUSER" | "USER" = session?.user?.role === "SUPERUSER" ? "SUPERUSER" : "USER";
  const email = session?.user.email ?? "";

  return <Dashboard role={role} email={email} />;
}