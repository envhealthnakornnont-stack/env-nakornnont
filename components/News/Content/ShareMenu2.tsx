"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Copy, Share2, Facebook, Twitter, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ShareMenu() {
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${base}${pathname}`;

  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("คัดลอกลิงก์แล้ว", { description: "ลิงก์ถูกคัดลอกไปยังคลิปบอร์ด" });
    } catch {
      toast.error("คัดลอกไม่สำเร็จ", { description: "โปรดลองอีกครั้ง" });
    }
  };

  const lineShare = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" aria-label="แชร์บทความ">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>แชร์ลิงก์</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}>
          <Facebook className="mr-2 h-4 w-4" /> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`)}>
          <Twitter className="mr-2 h-4 w-4" /> X / Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(lineShare)}>
          <svg viewBox="0 0 36 36" className="mr-2 h-4 w-4"><path d="M30 16.2c0-5.52-5.37-10-12-10S6 10.68 6 16.2C6 22 11.38 26 18 26c.74 0 1.46-.05 2.16-.15.77.45 2.69 1.55 4.17 2 .4.12.76-.26.64-.65-.3-1.05-.58-2.28-.46-2.94 3.4-1.82 5.49-4.85 5.49-8.06Z"/></svg>
          Line
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => (window.location.href = `mailto:?subject=${encodeURIComponent("แชร์บทความ")}&body=${encodeURIComponent(url)}`)}
        >
          <Mail className="mr-2 h-4 w-4" /> Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copy}>
          <Copy className="mr-2 h-4 w-4" /> คัดลอกลิงก์
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}