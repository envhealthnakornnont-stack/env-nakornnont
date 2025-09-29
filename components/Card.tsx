import Link from "next/link";
import Image from "next/image";
import { NewsItems, ActivitiesItems, E_Service } from "@/types/publicTypes";

interface CardProps<T> {
  news: T;
  cardType: string;
}

const resolveImagePath = (img: string | null | undefined) => {
  if (!img) return "/default-news.png";
  if (img.startsWith("/uploads")) {
    return `/api/uploads${img}`;
  }
  return img;
};

const Card = <T extends NewsItems | ActivitiesItems | E_Service>({
  news,
  cardType,
}: CardProps<T>) => {
  const MAX_LENGTH = 120;

  if (cardType === "type1") {
    const newsItem = news as NewsItems;
    const description = newsItem.description || "";
    const truncatedDescription =
      description.length > MAX_LENGTH
        ? description.slice(0, MAX_LENGTH) + "..."
        : description;

    return (
      <div className="card bg-base-200 w-full shadow-md">
        <figure className="w-full h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[400px] overflow-hidden">
          <Image
            src={resolveImagePath(newsItem.image)}
            alt={newsItem.title}
            width={800}
            height={600}
            className="w-full h-full object-cover object-top"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{newsItem.title}</h2>
          <p>{truncatedDescription}</p>
          <p className="flex flex-col justify-end text-sm">
            <span>
              โดย: {newsItem.author.firstname} {newsItem.author.lastname}
            </span>
            <span>ส่วนงาน: {newsItem.author.department}</span>
          </p>
          <div className="card-actions justify-between">
            <div className="text-sm self-center">
              โพสต์เมื่อ: {newsItem.createdAt}
            </div>
            <Link
              href={`/news/news-updates/${newsItem.id}`}
              className="btn btn-primary"
            >
              อ่านเพิ่มเติม
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cardType === "type2") {
    const activityItem = news as ActivitiesItems;

    return (
      <Link
        href={`/news/activities/${activityItem.id}`}
      >
        <div className="w-full shadow-md rounded-2xl relative overflow-hidden group">
          <figure className="w-full h-[450px] lg:h-[550px] 2xl:h-[650px] overflow-hidden">
            <Image
              src={resolveImagePath(activityItem.image)}
              alt={activityItem.title}
              fill
              className="rounded-2xl block w-full h-full object-cover object-top"
            />
          </figure>
          <div className="absolute bottom-0 left-0 w-full bg-base-300/90 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 xl:p-8">
            <h3 className="lg:text-xl sm:text-lg text-base font-bold mb-2 lg:mb-4">
              {activityItem.title}
            </h3>
            <div className="text-sm md:flex md:justify-between">
              <p className="self-center">
                โพสต์เมื่อ: {activityItem.createdAt}
              </p>
              <p className="flex flex-col">
                <span>
                  โดย: {activityItem.author.firstname}{" "}
                  {activityItem.author.lastname}
                </span>
                <span>ส่วนงาน: {activityItem.author.department}</span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (cardType === "type3") {
    const service = news as E_Service;

    return (
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300">
        <figure className="w-full h-[300px] sm:h-[550px] md:h-[320px] lg:h-[340px] xl:h-[400px] 2xl:h-[450px] overflow-hidden">
          <Image
            src={resolveImagePath(service.image as string)}
            alt={service.title}
            width={300}
            height={540}
            className="object-cover w-full h-full"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-base-content">{service.title}</h2>
          <div className="mt-2">
            <Link
              href={service.linkURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary w-full"
            >
              เข้าสู่ระบบบริการ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Card;
