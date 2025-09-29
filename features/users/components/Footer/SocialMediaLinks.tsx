import { FacebookSolidIcon, LineSolidIcon, YoutubeSolidIcon } from "@/config/iconConfig";
import Link from "next/link";

const SocialMediaLinks = () => {
  return (
    <div className="grid grid-flow-col gap-4">
      <Link href={`https://youtube.com/channel/UCF6cYBJG4oNgLmKoAh8gn4w?si=Kk-boDIiAAUKfsCB`} target="_blank">
        <YoutubeSolidIcon/>
      </Link>
      <Link href={`https://www.facebook.com/Bureauofpublichealthandenvironment`} target="_blank">
        <FacebookSolidIcon />
      </Link>
      <a>
        <LineSolidIcon />
      </a>
    </div>
  );
};

export default SocialMediaLinks;
