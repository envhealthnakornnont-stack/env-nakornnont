import React from "react";
import Link from "next/link";
import { BannerImage, BannerVideo } from "@/types/publicTypes";
import BannerCard from "@/features/admin/components/BannerManagement/BannerCard";

interface BannerCardsGridProps {
  management?: string;
  banners: (BannerImage | BannerVideo)[];
  createLink: string;
  editLink: string;
  deleteApi: string;
}

const BannerCardsGrid: React.FC<BannerCardsGridProps> = ({ management, banners, createLink, editLink, deleteApi }) => {
  const totalCards = 6;
  const emptyCount = Math.max(totalCards - banners.length, 0);
  
  function isBannerImage(banner: BannerImage | BannerVideo): banner is BannerImage {
    return (banner as BannerImage) !== undefined;
  }
  
  function isBannerVideo(banner: BannerImage | BannerVideo): banner is BannerVideo {
    return (banner as BannerVideo) !== undefined;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {banners.map((banner) => {
        if (isBannerImage(banner)) {
          return (
            <BannerCard
              key={banner.id}
              management={management}
              banner={banner}
              editLink={`${editLink}/${banner.id}`}
              deleteApi={deleteApi}
            />
          );
        } else if (isBannerVideo(banner)) {
          return (
            <BannerCard
              key={banner.id}
              management={management}
              banner={banner}
              editLink={`${editLink}/${banner.id}`}
              deleteApi={deleteApi}
            />
          );
        } else {
          return null;
        }
      })}

      {Array.from({ length: emptyCount }).map((_, index) => (
        <div
          key={index}
          className="card card-compact bg-base-100 border-2 border-dashed border-base-content shadow-sm flex flex-col items-center justify-center p-4"
        >
          <p className="mb-4 font-bold">ไม่มีแบนเนอร์</p>
          <Link href={createLink} className="btn btn-primary">
            สร้างแบนเนอร์ใหม่
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BannerCardsGrid;
