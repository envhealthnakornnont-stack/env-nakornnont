import AvatarCard from "./AvatarCard";
import { Personnel } from "@/types/publicTypes";

type AvatarGridProps = {
  personnel: (Personnel & { level: number })[];
  level: number;
  columns?: string;
};

const AvatarGrid = ({ personnel, level, columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" }: AvatarGridProps) => {
  const filtered = personnel.filter((person) => person.level === level);
  if (filtered.length === 0) return null;

  const resolveImagePath = (img: string | null | undefined) => {
    if (!img) return "/default-avatar.png";
    if (img.startsWith("/uploads")) {
      return `/api/uploads${img}`;
    }
    return img;
  };

  return (
    <div className={`py-10 grid ${columns} gap-5`}>
      {filtered.map((person, index) => (
        <AvatarCard
          key={index}
          image={`${resolveImagePath(person.image)}`} // แปลงให้ใช้ API uploads
          name={`${person.nameTitle}${person.firstName} ${person.lastName}`}
          position={person.positionName}
          colSpan={level === 1 ? "col-span-4" : "col-span-1"}
        />
      ))}
    </div>
  );
};

export default AvatarGrid;
