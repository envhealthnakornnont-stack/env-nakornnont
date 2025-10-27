import DepartmentView from "@/components/Departments/DepartmentView";
import { departments } from "@/components/Departments/utils";
import EnvironmentalHealthPromotionSection from "@/features/users/components/Departments/EnvironmentalHealthPromotionSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: departments.environmentalHealthPromotion.seo.title,
  description: departments.environmentalHealthPromotion.seo.description,
  openGraph: {
    title: departments.environmentalHealthPromotion.seo.title,
    description: departments.environmentalHealthPromotion.seo.description,
    url: "/departments/environmental-health-promotion",
    siteName: "เทศบาลนครนนทบุรี",
    locale: "th_TH",
    type: "article",
    images: [departments.environmentalHealthPromotion.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: departments.environmentalHealthPromotion.seo.title,
    description: departments.environmentalHealthPromotion.seo.description,
    images: [departments.environmentalHealthPromotion.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  alternates: { canonical: "/departments/environmental-health-promotion" },
  keywords: departments.environmentalHealthPromotion.seo.keywords,
};

export default function Page() {
  return <DepartmentView dept="environmentalHealthPromotion" />;
}