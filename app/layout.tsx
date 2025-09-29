import { cookies } from "next/headers";
import "./globals.css";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const logoUrl = `/logo-nonthaburi.jpg`;

export const metadata = {
  metadataBase: new URL(baseURL),
  title: "หน้าแรก | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  description:
    "เว็บไซต์ทางการของสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี ให้บริการข้อมูลข่าวสาร บริการสาธารณสุข งานสิ่งแวดล้อม และการพัฒนาคุณภาพชีวิตประชาชน",
  keywords: [
    "เทศบาลนครนนทบุรี",
    "สำนักสาธารณสุขและสิ่งแวดล้อม",
    "บริการสาธารณสุข",
    "สิ่งแวดล้อม",
    "ข่าวเทศบาล",
    "บริการประชาชน",
    "สุขภาพ",
    "ขยะ",
    "ฉีดวัคซีน",
    "โรคระบาด",
  ],
  openGraph: {
    title: "หน้าแรก | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "เว็บไซต์อย่างเป็นทางการเพื่อบริการประชาชนด้านสุขภาพ สิ่งแวดล้อม และข้อมูลข่าวสาร",
    siteName: "เทศบาลนครนนทบุรี",
    images: [logoUrl],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "หน้าแรก | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    description:
      "ติดตามข่าวสาร บริการสุขภาพ และงานสิ่งแวดล้อมจากเทศบาลนครนนทบุรี",
    images: [logoUrl],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = (await cookies()).get("theme")?.value || "light";
  return (
    <html lang="en" data-theme={theme}>
      <body className={`antialiased bg-base-300/30`}>
        {children}
      </body>
    </html>
  );
}
