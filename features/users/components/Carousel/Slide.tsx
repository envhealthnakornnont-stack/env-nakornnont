"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { BannerVideo } from "@/types/publicTypes";

interface SlideProps {
  slide: BannerVideo;
  isActive: boolean;
  isPrev: boolean;
  isNext: boolean; // ต้องส่งจาก Carousel
}

// ใช้ public path ตรง ๆ เพื่อให้ได้ Range requests
const resolveVideoPath = (video: string | null | undefined) => {
  if (!video) return "/default-carousel.mp4";
  if (video.startsWith("/uploads")) {
    return `/api/uploads${video}`;
  }
  return video;
};

// ถ้าจับโปสเตอร์ไม่ได้ จะใช้ภาพนี้
const FALLBACK_POSTER = "/default-poster.jpg";

// จับเฟรมแรกออกมาเป็น dataURL (JPEG) — ทำเฉพาะตอนจำเป็น
async function capturePosterFromVideo(src: string, w = 1280, h = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    // ถ้าไฟล์อยู่คนละโดเมน ต้องตั้ง CORS ให้ถูกที่ฝั่งเซิร์ฟเวอร์ด้วย
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = src;

    const onError = () => {
      cleanup();
      reject(new Error("Failed to load video for poster"));
    };

    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.pause();
      // ไม่ต้องเพิ่ม video ลง DOM
    };

    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context is null");
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        cleanup();
        resolve(dataUrl);
      } catch (e) {
        cleanup();
        reject(e);
      }
    };

    const onLoadedMeta = () => {
      // กระโดดไปเฟรมต้น ๆ เพื่อให้แน่ใจว่ามีภาพ (0.1s)
      try {
        video.currentTime = Math.min(0.1, video.duration || 0.1);
      } catch {
        // บางกรณีต้องรออีกนิดให้ browser อัปเดต duration
        setTimeout(() => {
          try {
            video.currentTime = Math.min(0.1, video.duration || 0.1);
          } catch {
            onError();
          }
        }, 50);
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
  });
}

const Slide: React.FC<SlideProps> = ({ slide, isActive, isPrev, isNext }) => {
  const containerClass =
    "absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out " +
    (isActive ? "translate-x-0" : isPrev ? "-translate-x-full" : "translate-x-full");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // เลือก src ตาม viewport
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const chosenSrc = useMemo(
    () => resolveVideoPath(isMobile ? slide.videoMobile : slide.videoDesktop),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slide.videoMobile, slide.videoDesktop, isMobile]
  );

  // จับโปสเตอร์: ทำเฉพาะตอนสไลด์กำลังจะเล่น (next) หรือกำลังเล่น (active) และยังไม่มีโปสเตอร์
  useEffect(() => {
    let cancelled = false;
    if ((isActive || isNext) && !posterUrl && chosenSrc) {
      capturePosterFromVideo(chosenSrc, 1280, 720)
        .then((url) => {
          if (!cancelled) setPosterUrl(url);
        })
        .catch(() => {
          if (!cancelled) setPosterUrl(FALLBACK_POSTER);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [isActive, isNext, posterUrl, chosenSrc]);

  // คุมเล่น/หยุดเฉพาะ active
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => { });
    } else {
      v.pause();
    }
  }, [isActive]);

  // ถ้าไม่ใช่ active และไม่ใช่ next → แสดงโปสเตอร์ (เบาที่สุด)
  if (!isActive && !isNext) {
    return (
      <div className={containerClass}>
        <img
          src={posterUrl || FALLBACK_POSTER}
          alt={slide.title || "banner"}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // active/next → ใช้วิดีโอ (next ใช้ preload="metadata")
  return (
    <div className={containerClass}>
      <div className="relative w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          preload={isActive ? "auto" : "metadata"}
          autoPlay={isActive}
          muted
          playsInline
          loop
          poster={posterUrl || FALLBACK_POSTER}
        >
          <source src={resolveVideoPath(slide.videoMobile)} type="video/mp4" media="(max-width: 768px)" />
          <source src={resolveVideoPath(slide.videoDesktop)} type="video/mp4" media="(min-width: 769px)" />
        </video>
      </div>
    </div>
  );
};

export default Slide;
