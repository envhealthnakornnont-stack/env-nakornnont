import PublicHealthPromotionSection from "@/features/users/components/Departments/PublicHealthPromotionSection";
import type { Metadata } from "next";
import DepartmentView from "@/components/Departments/DepartmentView";
import { departments } from "@/components/Departments/utils";

export const metadata: Metadata = {
  title: departments.publicHealthPromotion.seo.title,
  description: departments.publicHealthPromotion.seo.description,
  openGraph: {
    title: departments.publicHealthPromotion.seo.title,
    description: departments.publicHealthPromotion.seo.description,
    url: "/departments/public-health-promotion",
    siteName: "เทศบาลนครนนทบุรี",
    locale: "th_TH",
    type: "article",
    images: [departments.publicHealthPromotion.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: departments.publicHealthPromotion.seo.title,
    description: departments.publicHealthPromotion.seo.description,
    images: [departments.publicHealthPromotion.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  alternates: { canonical: "/departments/public-health-promotion" },
  keywords: departments.publicHealthPromotion.seo.keywords,
};

const page = () => {
  return <DepartmentView dept="publicHealthPromotion" />;
}

export default page