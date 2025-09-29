import GoogleMapEmbed from "./GoogleMapEmbed";
import ContactDetails from "./ContactDetails";
import Image from "next/image";

const ContactInfo = () => {
  return (
    <aside className="flex flex-col sm:flex-row md:gap-4 w-full xl:w-11/12 mx-auto">
      <div className="hidden lg:flex flex-col flex-1 items-center">
        <ul className="menu bg-base-200 rounded-box w-80 xl:w-4/5">
          <h2 className="menu-title text-base-content">แผนที่</h2>
          <li>
            <details open className="flex flex-col gap-2">
              <summary>สำนักสาธารณสุขและสิ่งแวดล้อม</summary>
              <div className="self-center shadow-md rounded-box overflow-hidden border-2 border-base-content h-48 lg:w-full">
                <GoogleMapEmbed src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7747.243867631507!2d100.513576!3d13.861718000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x57078dcef1af9d03!2z4Liq4Liz4LiZ4Lix4LiB4LiH4Liy4LiZ4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4LiZ4LiZ4LiX4Lia4Li44Lij4Li1!5e0!3m2!1sth!2sth!4v1657758534123!5m2!1sth!2sth" />
              </div>
              <p className="p-3 text-center">
                1,3 ซอยรัตนาธิเบศร์ 6 ถนนรัตนาธิเบศร์ ตำบลบางกระสอ อำเภอเมืองนนทบุรี
                จังหวัดนนทบุรี 11000
              </p>
            </details>
          </li>
          <li>
            <details className="flex flex-col gap-2">
              <summary>ศูนย์บริการและพัฒนาคุณภาพสิ่งแวดล้อม</summary>
              <div className="self-center shadow-md rounded-box overflow-hidden border-2 border-base-content h-48 lg:w-full">
                <GoogleMapEmbed src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d684.7498423161907!2d100.52867844883572!3d13.867224165027448!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b55e9e1df2b%3A0xa30971d69b2632ac!2z4Lio4Li54LiZ4Lii4LmM4Lia4Lij4Li04LiB4Liy4Lij4LmB4Lil4Liw4Lie4Lix4LiS4LiZ4Liy4LiE4Li44LiT4Lig4Liy4Lie4Liq4Li04LmI4LiH4LmB4Lin4LiU4Lil4LmJ4Lit4LihIOC5gOC4l-C4qOC4muC4suC4peC4meC4hOC4o-C4meC4meC4l-C4muC4uOC4o-C4tSAo4LmC4Lij4LiH4Lib4Li44LmL4Lii4LiK4Li14Lin4Lig4Liy4LieKQ!5e0!3m2!1sth!2sth!4v1738207319106!5m2!1sth!2sth" />
              </div>
              <p className="p-3 text-center">
                ซอยติวานนท์ 24แยก13 ตำบลบางกระสอ
                อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000
              </p>
            </details>
          </li>
          <li>
            <details className="flex flex-col gap-2">
              <summary>คลินิกสัตว์แพทย์เทศบาลนครนนทบุรี</summary>
              <div className="self-center shadow-md rounded-box overflow-hidden border-2 border-base-content h-48 lg:w-full">
                <GoogleMapEmbed src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d242.09165343790218!2d100.5322154202854!3d13.87103440096826!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d157c85c4cd%3A0xd451fa24994edfd2!2z4LiE4Lil4Li04LiZ4Li04LiB4Liq4Lix4LiV4Lin4LmB4Lie4LiX4Lii4LmM4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4LiZ4LiZ4LiX4Lia4Li44Lij4Li1!5e0!3m2!1sth!2sth!4v1738207398209!5m2!1sth!2sth" />
              </div>
              <p className="p-3 text-center">
                ประชานิเวศน์ 3 ซอย 14 ท่าทราย อำเภอเมืองนนทบุรี นนทบุรี 11000
              </p>
            </details>
          </li>
        </ul>

      </div>
      <div className="flex flex-col items-center xl:inline-flex p-8 flex-1 w-full">
        <Image
          src="/mobile/mobile-logo.png"
          width={120}
          height={120}
          alt="Picture of the author"
        />
        <p className="font-bold text-lg py-4 text-center">นครนนท์เมืองน่าอยู่ ประชาชนมีคุณภาพชีวิตที่ดี <br /> มีบริการที่เป็นเลิศ และบริหารจัดการที่ดี</p>
      </div>
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="">
          <ul className="menu bg-base-200 rounded-box flex-row">
            <ContactDetails />
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default ContactInfo;
