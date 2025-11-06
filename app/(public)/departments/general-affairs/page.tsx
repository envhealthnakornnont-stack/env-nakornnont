import DepartmentView from "@/components/Departments/DepartmentView";
import { departments } from "@/components/Departments/utils";
// import GeneralAffairsSection from "@/features/users/components/Departments/GeneralAffairsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: departments.generalAffairs.seo.title,
  description: departments.generalAffairs.seo.description,
  openGraph: {
    title: departments.generalAffairs.seo.title,
    description: departments.generalAffairs.seo.description,
    url: "/departments/general-affairs",
    siteName: "เทศบาลนครนนทบุรี",
    locale: "th_TH",
    type: "article",
    images: [departments.generalAffairs.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: departments.generalAffairs.seo.title,
    description: departments.generalAffairs.seo.description,
    images: [departments.generalAffairs.seo.openGraphImage ?? "/logo-nonthaburi.jpg"],
  },
  alternates: { canonical: "/departments/general-affairs" },
  keywords: departments.generalAffairs.seo.keywords,
};

const page = () => {
  return <DepartmentView dept="generalAffairs" />;
}

export default page