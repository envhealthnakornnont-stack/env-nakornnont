"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Props = {
  title: string;
  address: string;
  embedUrl: string;
  linkUrl: string;
  triggerLabel?: string;
};

export default function MapDialog({ title, address, embedUrl, linkUrl, triggerLabel = "ดูแผนที่" }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="ghost">{triggerLabel}</Button></DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl p-0 sm:p-6">
        <DialogHeader className="px-4 pt-4 sm:px-0 sm:pt-0">
          <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm min-w-0 break-all [overflow-wrap:anywhere]">{`ตำแหน่ง: ${address}`}</DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-4 sm:px-0 sm:pb-0">
          <div className="w-full h-[50vh] sm:h-[60vh] overflow-hidden rounded-md ring-1 ring-border">
            <iframe title={title} src={embedUrl} width="100%" height="100%" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="pt-3 flex justify-end">
            <Button asChild><Link href={linkUrl} target="_blank" className="inline-flex items-center gap-2">เปิดใน Google Maps <ExternalLink className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
