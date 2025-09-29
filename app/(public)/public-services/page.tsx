import Breadcrumbs from "@/components/Breadcrumbs"
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import { E_Service } from "@/types/publicTypes";

async function fetchService(): Promise<E_Service[]> {
  const baseURL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseURL}/api/eservice`, {
      next: { revalidate: 30 }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const service = data;
    return service;
  } catch (error) {
    console.error("Error fetching E-Service data:", error);
    return [];
  }
}

const page = async () => {
  const breadcrumbs = [
    { label: "หน้าแรก", href: "/" },
    { label: "E-SERVICE", href: "/about/public-services", isCurrent: true },
  ];
  const service = await fetchService();
  return (
    <div className="px-10 py-5 xl:px-20 xl:py-10">
      <Breadcrumbs items={breadcrumbs} />
      <div className="my-3">
        <h1 className="text-2xl sm:text-3xl font-bold">E-SERVICE</h1>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.map((s, i) => {
            return <Card key={i} news={s} cardType={"type3"} />
          })}
        </div>
      </div>
    </div>
  )
}

export default page