// prisma/seed.ts
import { PrismaClient, PublishStatus } from "@prisma/client";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// ---- ตั้งค่าผู้ใช้หลักเพียงคนเดียว ----
const ADMIN = {
  email: "env.health.nakornnont@gmail.com",
  firstname: "Env",
  lastname: "Nakornnont",
  role: "SUPERUSER" as "SUPERUSER" | "USER",
  department: "ผู้ดูแลระบบสูงสุด",
  avatar: "", // เก็บเป็น null ถ้าว่าง
  password: "$2b$12$g/nh5pgFRQQzFiZaT.uRzuIun1elRbJFfBHYqgO7kGAvP7HZ2.H7m"
};

// ---- helpers ----
function makeSlugFromTitle(title: string) {
  const isThai = /[\u0E00-\u0E7F]/.test(title);
  return isThai
    ? `${title.trim().replace(/\s+/g, "-")}-${uuidv4().slice(0, 8)}`
    : slugify(title, { lower: true, strict: true });
}

function tagSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-ก-๙]/gi, "");
}

async function ensureTags(names: string[]) {
  const results: { id: string; name: string; slug: string }[] = [];
  for (const name of Array.from(new Set(names))) {
    const slug = tagSlug(name);
    const t = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
      select: { id: true, name: true, slug: true },
    });
    results.push(t);
  }
  return results;
}

async function main() {
  // 1) สร้าง/อัปเดตผู้ใช้หลักเพียงคนเดียว
  const admin = await prisma.user.upsert({
    where: { email: ADMIN.email },
    update: {
      firstname: ADMIN.firstname,
      lastname: ADMIN.lastname,
      role: ADMIN.role,
      department: ADMIN.department,
      avatar: ADMIN.avatar || null,
      password: ADMIN.password
    },
    create: {
      email: ADMIN.email,
      firstname: ADMIN.firstname,
      lastname: ADMIN.lastname,
      role: ADMIN.role,
      department: ADMIN.department,
      avatar: ADMIN.avatar || null,
      password: ADMIN.password
    },
  });

  // 2) Tags
  const newsTags = await ensureTags(["PM2.5", "สิ่งแวดล้อม", "นโยบายเมือง"]);
  const actTags = await ensureTags(["ชุมชน", "สุขาภิบาล", "ยุงลาย", "Big Cleaning"]);

  // 3) News #1
  const newsTitle1 = "รายงานสถานการณ์ PM2.5 และมาตรการเมืองสีเขียวไตรมาส 4";
  const newsSlug1 = makeSlugFromTitle(newsTitle1);

  await prisma.news.upsert({
    where: { slug: newsSlug1 },
    update: {},
    create: {
      title: newsTitle1,
      slug: newsSlug1,
      description: "สรุปมาตรการเมืองสีเขียวและแนวโน้ม PM2.5 ประจำไตรมาส 4",
      image: "https://cdn.pixabay.com/photo/2023/10/13/19/54/meadows-8313453_1280.jpg",
      heroCredit: "กองสิ่งแวดล้อม",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      contentHtml: `
        <p>เทศบาลประกาศเดินหน้ามาตรการ <strong>เมืองสีเขียว</strong> เพื่อลดค่าฝุ่น PM2.5 อย่างยั่งยืน โดยผสานข้อมูลจากเซ็นเซอร์คุณภาพอากาศและการเพิ่มพื้นที่สีเขียวตามจุดเสี่ยง</p>
        <figure>
          <img src="https://cdn.pixabay.com/photo/2023/12/15/22/37/mountains-8451480_960_720.jpg" alt="แผนที่ค่าฝุ่น PM2.5 รายเขต" />
          <figcaption>แผนที่ความหนาแน่น PM2.5 จากจุดวัดชุมชน</figcaption>
        </figure>
        <h2>มาตรการสำคัญ</h2>
        <ol>
          <li><strong>เพิ่มแนวต้นไม้</strong> ในถนนหลักและจุดพักรถ</li>
          <li><strong>ปรับภูมิทัศน์ทางเดิน–จักรยาน</strong> ให้เชื่อมต่อสวนสาธารณะมากขึ้น</li>
          <li><strong>บริหารเส้นทางเก็บขยะ</strong> เพื่อลดการเผาในที่โล่ง</li>
        </ol>
        <p>ข้อมูลเชิงพื้นที่จะถูกนำไปใช้กำหนดจุดติดตั้งเซ็นเซอร์ใหม่และกิจกรรมรณรงค์</p>
        <figure>
          <img src="https://cdn.pixabay.com/photo/2020/09/04/16/18/mountains-5544365_960_720.jpg" alt="คอร์ริดอร์สีเขียวริมคลอง" />
          <figcaption>ตัวอย่างคอร์ริดอร์สีเขียวที่เพิ่มพื้นที่กรองฝุ่น</figcaption>
        </figure>
        <blockquote>อากาศดีไม่ใช่เรื่องฟลุค แต่คือผลจากการออกแบบเมืองร่วมกัน</blockquote>
      `.trim(),
      authorId: admin.id,
      authorSnapshot: {
        name: `${admin.firstname} ${admin.lastname}`,
        email: admin.email,
        department: admin.department,
        avatar: admin.avatar,
      },
      attachments: [
        { label: "รายงานสรุปไตรมาส 4 (PDF)", url: "/demo/docs/pm25-q4.pdf" },
        { label: "พิกัดจุดวัดคุณภาพอากาศ (GeoJSON)", url: "/demo/docs/sensors.geojson" },
      ],
      tags: { connect: newsTags.map((t) => ({ id: t.id })) },
    },
  });

  // 4) News #2
  const newsTitle2 = "อัพเดตพื้นที่สีเขียวเพิ่มขึ้นในระยะเดินถึง 800 เมตร";
  const newsSlug2 = makeSlugFromTitle(newsTitle2);
  await prisma.news.upsert({
    where: { slug: newsSlug2 },
    update: {},
    create: {
      title: newsTitle2,
      slug: newsSlug2,
      description: "สรุปผลเบื้องต้นของการเชื่อมต่อโครงข่ายพื้นที่สีเขียว",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      image: "https://cdn.pixabay.com/photo/2020/09/11/00/11/landscape-5561678_1280.jpg",
      contentHtml: `
        <p>ทีมงานเร่งปรับภูมิทัศน์ทางเดินและจักรยาน เพื่อให้ประชาชนเข้าถึงพื้นที่สีเขียวได้ภายใน 800 เมตร</p>
        <img src="https://cdn.pixabay.com/photo/2020/09/11/00/11/landscape-5561678_1280.jpg" alt="ตัวอย่างคอร์ริดอร์สีเขียว" />
      `.trim(),
      authorId: admin.id,
      authorSnapshot: {
        name: `${admin.firstname} ${admin.lastname}`,
        email: admin.email,
        department: admin.department,
        avatar: admin.avatar,
      },
      tags: { connect: newsTags.map((t) => ({ id: t.id })) },
    },
  });

  // 5) Activity #1
  const actTitle1 = "Kick-off โครงการชุมชนสะอาด ปลอดยุงลาย เขตตลาดบางกระสอ";
  const actSlug1 = makeSlugFromTitle(actTitle1);
  await prisma.activity.upsert({
    where: { slug: actSlug1 },
    update: {},
    create: {
      title: actTitle1,
      slug: actSlug1,
      status: PublishStatus.PUBLISHED,
      eventDate: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      image: "https://cdn.pixabay.com/photo/2016/09/22/14/26/sweeper-1687444_1280.jpg",
      location: "ลานกิจกรรม ตลาดบางกระสอ",
      organizer: "ฝ่ายสิ่งแวดล้อม",
      contentHtml: `
        <p>เปิดโครงการ <strong>ชุมชนสะอาด ปลอดยุงลาย</strong> ด้วยกิจกรรม Big Cleaning และให้ความรู้เรื่องการกำจัดแหล่งเพาะพันธุ์ยุงลาย</p>
        <ul>
          <li>ทำความสะอาดพื้นที่ตลาดและล้างรางระบายน้ำ</li>
          <li>สำรวจและกำจัดลูกน้ำยุงลายในภาชนะ</li>
          <li>ให้ความรู้เรื่องการคัดแยกขยะและการเก็บน้ำที่ถูกวิธี</li>
        </ul>
        <blockquote>ชุมชนสะอาด เราทำได้ เริ่มจากบ้านของเราเอง</blockquote>
      `.trim(),
      authorId: admin.id,
      authorSnapshot: {
        name: `${admin.firstname} ${admin.lastname}`,
        email: admin.email,
        department: admin.department,
        avatar: admin.avatar,
      },
      attachments: [
        { label: "คู่มือป้องกันยุงลาย (PDF)", url: "/demo/docs/aedes-guide.pdf" },
        { label: "โปสเตอร์ Big Cleaning", url: "/demo/docs/poster.jpg" },
      ],
      gallery: [
        { src: "https://cdn.pixabay.com/photo/2016/09/22/14/26/sweeper-1687444_1280.jpg", alt: "บรีฟงานก่อนเริ่มทำความสะอาด" },
        { src: "https://cdn.pixabay.com/photo/2020/01/13/16/56/broom-4762980_1280.jpg", alt: "ทีมงานกำจัดลูกน้ำยุงลาย" },
        { src: "https://cdn.pixabay.com/photo/2022/10/03/01/00/woman-7494708_1280.jpg", alt: "อาสาสมัครช่วยกันคัดแยกขยะ" },
        { src: "https://cdn.pixabay.com/photo/2019/08/21/09/31/monk-4420676_960_720.jpg", alt: "ล้างพื้นและทำความสะอาดรางระบายน้ำ" },
      ],
      tags: { connect: actTags.map((t) => ({ id: t.id })) },
    },
  });

  // 6) Activity #2
  const actTitle2 = "กิจกรรมคัดแยกขยะชุมชนเขตพระนั่งเกล้า";
  const actSlug2 = makeSlugFromTitle(actTitle2);
  await prisma.activity.upsert({
    where: { slug: actSlug2 },
    update: {},
    create: {
      title: actTitle2,
      slug: actSlug2,
      status: PublishStatus.DRAFT,
      eventDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
      publishedAt: null,
      image: "https://cdn.pixabay.com/photo/2017/08/21/10/49/plant-2664872_1280.jpg",
      location: "ชุมชนพระนั่งเกล้า",
      organizer: "งานส่งเสริมสุขภาพ",
      contentHtml: `<p>กิจกรรมต้นแบบคัดแยกขยะร่วมกับชุมชน</p>`.trim(),
      authorId: admin.id,
      authorSnapshot: {
        name: `${admin.firstname} ${admin.lastname}`,
        email: admin.email,
        department: admin.department,
        avatar: admin.avatar,
      },
      tags: { connect: actTags.map((t) => ({ id: t.id })) },
    },
  });

  console.log("✅ Seed completed with single SUPERUSER.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
