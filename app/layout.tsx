import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const logoUrl = `/logo-nonthaburi.jpg`;

export const metadata: Metadata = {
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


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            richColors
            closeButton
            position="bottom-right"
            toastOptions={{
              classNames: {
                content:
                  "flex flex-row gap-2 [&>[data-title]]:font-medium " +
                  // กันบรรทัดยาวล้น / ให้พับอย่างสวย
                  "[&>[data-title]]:whitespace-normal [&>[data-title]]:overflow-wrap/anywhere " +
                  "[&>[data-description]]:text-muted-foreground " +
                  "[&>[data-description]]:whitespace-normal [&>[data-description]]:overflow-wrap/anywhere",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
