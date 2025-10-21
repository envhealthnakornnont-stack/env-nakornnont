"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FacebookSolidIcon, LineSolidIcon, YoutubeSolidIcon } from "@/config/iconConfig";

export default function SocialMediaLinks() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="icon" aria-label="YouTube">
        <Link href="https://youtube.com/channel/UCF6cYBJG4oNgLmKoAh8gn4w?si=Kk-boDIiAAUKfsCB" target="_blank">
          {/* <Youtube className="h-5 w-5" /> */}
          <YoutubeSolidIcon/>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="Facebook">
        <Link href="https://www.facebook.com/Bureauofpublichealthandenvironment" target="_blank">
          {/* <Facebook className="h-5 w-5" /> */}
          <FacebookSolidIcon />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="LINE">
        {/* TODO: ใส่ลิงก์ LINE Official หรือกลุ่มที่ถูกต้อง */}
        <Link href="https://lin.ee/mkBxWLV" target="_blank">
          {/* <MessageSquare className="h-5 w-5" /> */}
          <LineSolidIcon />
        </Link>
      </Button>
    </div>
  );
}
