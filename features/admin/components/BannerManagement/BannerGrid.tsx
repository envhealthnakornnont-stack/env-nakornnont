import React from "react";
import Link from "next/link";
import { BannerImage, CarouselImage } from "@/types/publicTypes";
import BannerCard from "@/features/admin/components/BannerManagement/BannerCard";

interface BannerCardsGridProps {
  management?: string;
  banners: (BannerImage | CarouselImage)[];
  createLink: string;
  editLink: string;
  deleteApi: string;
}

function isBannerImage(b: any): b is BannerImage {
  return "imageDesktop" in b && "imageMobile" in b;
}

function isCarouselImage(b: any): b is CarouselImage {
  return "imageDesktop" in b && "imageMobile" in b;
}

const BannerCardsGrid: React.FC<BannerCardsGridProps> = ({ management, banners, createLink, editLink, deleteApi }) => {
  const totalCards = 6;
  const emptyCount = Math.max(totalCards - banners.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {banners.map((banner) => {
        if (management === "image" && isBannerImage(banner)) {
          return (
            <BannerCard
              key={banner.id}
              management="image"
              banner={banner}
              editLink={`${editLink}/${banner.id}`}
              deleteApi={deleteApi}
            />
          );
        }
        if (management === "carousel-img" && isCarouselImage(banner)) {
          return (
            <BannerCard
              key={banner.id}
              management="carousel-img"
              banner={banner}
              editLink={`${editLink}/${banner.id}`}
              deleteApi={deleteApi}
            />
          );
        }
        return null;
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
