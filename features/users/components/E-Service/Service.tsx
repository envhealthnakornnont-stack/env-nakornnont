"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CpuIcon } from "@/config/iconConfig";
import { E_Service } from "@/types/publicTypes";

interface ServiceProps {
  service: E_Service[]
}

const Service = ({ service }: ServiceProps) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const resolveImagePath = (img: string | null | undefined) => {
    if (!img) return "/default-news.png";
    if (img.startsWith("/uploads")) {
      return `/api/uploads${img}`;
    }
    return img;
  };

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    let intervalId: NodeJS.Timeout;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (carousel) {
          const scrollWidth = carousel.scrollWidth;
          const scrollLeft = carousel.scrollLeft;
          const clientWidth = carousel.clientWidth;

          // ถ้าสุดขอบแล้ว ให้กลับไปเริ่มใหม่
          if (scrollLeft + clientWidth >= scrollWidth) {
            carousel.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            carousel.scrollBy({ left: clientWidth, behavior: "smooth" });
          }
        }
      }, 3000); // เลื่อนทุก 3 วินาที
    };

    const stopAutoplay = () => {
      clearInterval(intervalId);
    };

    // เริ่ม autoplay
    startAutoplay();

    // หยุด autoplay เมื่อเลื่อนด้วยมือ
    carousel.addEventListener("mouseover", stopAutoplay);
    carousel.addEventListener("mouseout", startAutoplay);

    // Cleanup event listeners และ interval
    return () => {
      stopAutoplay();
      carousel.removeEventListener("mouseover", stopAutoplay);
      carousel.removeEventListener("mouseout", startAutoplay);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center py-5 xl:py-20">
      <div>
        <h1 className="sm:text-3xl text-2xl font-bold inline-flex items-center justify-center gap-1">
          <CpuIcon />
          E-SERVICE
        </h1>
      </div>
      <div
        ref={carouselRef}
        className="carousel bg-base-300 space-x-4 p-4 w-full"
      >
        {service.map((service, index) => (
          <div
            key={index}
            className="carousel-item"
          >
            <Link href={service.linkURL} target="_blank">
              <figure className="w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px] overflow-hidden">
                <Image 
                src={resolveImagePath(String(service.image))} 
                alt={`Slide ${index + 1}`} 
                className="block w-full h-full object-cover" 
                width={300} 
                height={540} />
              </figure>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
