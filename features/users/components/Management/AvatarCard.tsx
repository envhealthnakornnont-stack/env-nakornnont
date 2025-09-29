import Image from "next/image";

type AvatarCardProps = {
  image: string;
  name: string;
  position: string;
  colSpan?: string; // กำหนดขนาด col-span ได้
};

const AvatarCard = ({ image, name, position, colSpan = "col-span-1" }: AvatarCardProps) => {
  return (
    <div className={colSpan}>
      <div className="flex flex-col items-center gap-2">
        <div className="avatar">
          <div className="ring-primary bg-base-300 ring-offset-base-100 w-36 xl:w-40 rounded-full ring ring-offset-2">
            <Image
              src={image}
              alt={name}
              width={144}
              height={144}
              className="object-top rounded-full"
            />
          </div>
        </div>
        <div className="p-5 text-center">
          <h3 className="sm:text-lg font-bold">{name}</h3>
          <h4 className="sm:text-base text-sm">{position}</h4>
        </div>
      </div>
    </div>
  );
};

export default AvatarCard;
