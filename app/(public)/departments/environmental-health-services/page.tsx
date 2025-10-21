import DepartmentPage from "@/components/Departments/DepartmentPage";
import EnvironmentalHealthServicesSection from "@/features/users/components/Departments/EnvironmentalHealthServicesSection";
import { departments } from "@/lib/departments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: departments.environmentalHealthServices.seo.title,
  description: departments.environmentalHealthServices.seo.description,
  openGraph: {
    title: departments.environmentalHealthServices.seo.title,
    description: departments.environmentalHealthServices.seo.description,
    url: "/departments/environmental-health-services",
    siteName: "เทศบาลนครนนทบุรี",
    locale: "th_TH",
    type: "article",
    images: [departments.environmentalHealthServices.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: departments.environmentalHealthServices.seo.title,
    description: departments.environmentalHealthServices.seo.description,
    images: [departments.environmentalHealthServices.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  alternates: { canonical: "/departments/environmental-health-services" },
  keywords: departments.environmentalHealthServices.seo.keywords,
};

const page = () => {
  return <DepartmentPage dept="environmentalHealthServices" />;
}

export default page