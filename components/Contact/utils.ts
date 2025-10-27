import type { ContactPoint } from "./types";

export const EMAIL = "Env.health.nakornnont@gmail.com";

const MAIN_ADDRESS =
  "1,3 ซอยรัตนาธิเบศร์ 6 ตำบลบางกระสอ อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000";

export const CONTACT_POINTS: ContactPoint[] = [
  {
    title: "สำนักสาธารณสุขและสิ่งแวดล้อม",
    address: MAIN_ADDRESS,
    email: EMAIL,
    phones: [
      { label: "โทรกลาง", value: "0-2589-0500" },
      { label: "ฝ่ายวิชาการและการประเมินผล", value: "0-2589-0500 ต่อ 1218" },
      { label: "ฝ่ายส่งเสริมสาธารณสุข", value: "0-2589-0500 ต่อ 1214" },
      { label: "ฝ่ายจัดการมูลฝอยและสิ่งปฏิกูล", value: "0-2589-0500 ต่อ 1202" },
      { label: "ฝ่ายควบคุมและจัดการคุณภาพสิ่งแวดล้อม", value: "0-2589-0500 ต่อ 1207" },
    ],
    logoSrc: "/mobile/mobile-logo.png",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7747.243867631507!2d100.513576!3d13.861718000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x57078dcef1af9d03!2z4Liq4Liz4LiZ4Lix4LiB4LiH4Liy4LiZ4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4LiZ4LiZ4LiX4Lia4Li44Lij4Li1!5e0!3m2!1sth!2sth!4v1657758534123!5m2!1sth!2sth",
    mapsLinkUrl: "https://maps.app.goo.gl/DXWMLEhD8q6ap3hZ7",
  },
  {
    title: "ศูนย์บริการและพัฒนาคุณภาพสิ่งแวดล้อม",
    address: "ซอยติวานนท์ 24แยก13 ต.บางกระสอ อ.เมืองนนทบุรี นนทบุรี 11000",
    logoSrc: "/mobile/mobile-logo.png",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1936.764753669215!2d100.52820300000002!3d13.867257!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b55e9e1df2b%3A0xa30971d69b2632ac!2z4Lio4Li54LiZ4Lii4LmM4Lia4Lij4Li04LiB4Liy4Lij4LmB4Lil4Liw4Lie4Lix4LiS4LiZ4Liy4LiE4Li44LiT4Lig4Liy4Lie4Liq4Li04LmI4LiH4LmB4Lin4LiU4Lil4LmJ4Lit4LihIOC5gOC4l-C4qOC4muC4suC4peC4meC4hOC4o-C4meC4meC4l-C4muC4uOC4o-C4tSAo4LmC4Lij4LiH4Lib4Li44LmL4Lii4LiK4Li14Lin4Lig4Liy4LieKQ!5e0!3m2!1sth!2sth!4v1760385826075!5m2!1sth!2sth",
    mapsLinkUrl: "https://maps.app.goo.gl/t9peNe7VTxq3o18d8",
  },
  {
    title: "คลินิกสัตว์แพทย์เทศบาลนครนนทบุรี",
    address: "ประชานิเวศน์ 3 ซอย 14 ท่าทราย อ.เมืองนนทบุรี นนทบุรี 11000",
    logoSrc: "/mobile/mobile-logo.png",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d484.18345169979904!2d100.532262!3d13.870965!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d157c85c4cd%3A0xd451fa24994edfd2!2z4LiE4Lil4Li04LiZ4Li04LiB4Liq4Lix4LiV4Lin4LmB4Lie4LiX4Lii4LmM4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4LiZ4LiZ4LiX4Lia4Li44Lij4Li1!5e0!3m2!1sth!2sth!4v1760385662674!5m2!1sth!2sth",
    mapsLinkUrl: "https://maps.app.goo.gl/KXdzqzsU2QqEE5tB7",
  },
];
