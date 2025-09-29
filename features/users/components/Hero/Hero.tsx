import Image from "next/image";
import { BannerImage } from "@/types/publicTypes";

interface HeroProps {
    hero: BannerImage[]
}

const Hero = ({ hero }: HeroProps) => {

    const resolveImagePath = (img: string | null | undefined) => {
        if (!img) return "/default-news.png";
        if (img.startsWith("/uploads")) {
            return `/api/uploads${img}`;
        }
        return img;
    };

    return (
        <>
            {
                hero.map((img, i) => (
                    <div key={i}>
                        <Image
                            key={`mobile-${i}`}
                            src={resolveImagePath(img.imageMobile)}
                            alt={`Slide ${i + 1}`}
                            width={1920} height={1080}
                            className={`block md:hidden transition-opacity duration-700 ${i === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        />
                        <Image
                            key={`desktop-${i}`}
                            src={resolveImagePath(img.imageDesktop)}
                            alt={`Slide ${i + 1}`}
                            width={1920} height={1080}
                            className={`hidden md:block transition-opacity duration-700 ${i === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        />
                    </div>
                ))
            }
        </>
    );
};

export default Hero;
