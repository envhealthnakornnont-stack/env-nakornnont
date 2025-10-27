import NewsArticleModern from "@/components/News/Content/NewsArticle/demo/NewsArticleModern";
import type { NewsArticle } from "@/components/News/Content/NewsArticle/demo/types";

const mock: NewsArticle = {
    id: "n-002",
    title: "รายงานสถานการณ์ PM2.5 และมาตรการเมืองสีเขียวไตรมาส 4",
    hero: { src: "https://cdn.pixabay.com/photo/2023/10/13/19/54/meadows-8313453_1280.jpg", alt: "ภาพมุมสูงของเมืองสีเขียว", credit: "กองสิ่งแวดล้อม" },
    createdAt: new Date().toISOString(),
    tags: ["PM2.5", "สิ่งแวดล้อม", "นโยบายเมือง"],
    author: {
        name: "กาญจนา วัฒนะ",
        department: "งานส่งเสริมสุขภาพ",
        email: "kanjana@non.go.th",
        avatar: "/demo/avatars/kanjana.png",
    },
    attachments: [
        { label: "รายงานสรุปไตรมาส 4 (PDF)", url: "/demo/docs/pm25-q4.pdf" },
        { label: "พิกัดจุดวัดคุณภาพอากาศ (GeoJSON)", url: "/demo/docs/sensors.geojson" },
    ],
    // เนื้อหายาว + มีรูปแทรกหลายจุด (รูปทั้งหมดในบทความจะคลิกเพื่อขยายได้)
    contentHtml: `
    <p>เทศบาลประกาศเดินหน้ามาตรการ <strong>เมืองสีเขียว</strong> เพื่อลดค่าฝุ่น PM2.5 อย่างยั่งยืน โดยผสานข้อมูลจากเซ็นเซอร์คุณภาพอากาศและการเพิ่มพื้นที่สีเขียวตามจุดเสี่ยง</p>

    <figure>
      <img src="https://cdn.pixabay.com/photo/2023/12/15/22/37/mountains-8451480_960_720.jpg" alt="แผนที่ค่าฝุ่น PM2.5 รายเขต" />
      <figcaption>แผนที่ความหนาแน่น PM2.5 จากจุดวัดชุมชน</figcaption>
    </figure>

    <h2>มาตรการสำคัญ</h2>
    <ol>
      <li><strong>เพิ่มแนวต้นไม้</strong> ในถนนหลักและจุดพักรถ เพื่อดูดซับมลพิษ</li>
      <li><strong>ปรับภูมิทัศน์ทางเดิน–จักรยาน</strong> ให้เชื่อมต่อสวนสาธารณะมากขึ้น</li>
      <li><strong>บริหารเส้นทางเก็บขยะ</strong> เพื่อลดการเผาในที่โล่ง</li>
    </ol>

    <p>ข้อมูลเชิงพื้นที่จะถูกนำไปใช้กำหนด <em>จุดติดตั้งเซ็นเซอร์ใหม่</em> และกำหนดกิจกรรมรณรงค์ที่เหมาะกับบริบทของชุมชน</p>

    <figure>
      <img src="https://cdn.pixabay.com/photo/2020/09/04/16/18/mountains-5544365_960_720.jpg" alt="คอร์ริดอร์สีเขียวริมคลอง" />
      <figcaption>ตัวอย่างคอร์ริดอร์สีเขียวที่เพิ่มพื้นที่กรองฝุ่น</figcaption>
    </figure>

    <h3>ตัวชี้วัดความสำเร็จ</h3>
    <ul>
      <li>แนวโน้มค่า PM2.5 ลดลงต่อเนื่อง</li>
      <li>พื้นที่สีเขียวเพิ่มขึ้นในระยะเดินถึง (400–800 ม.)</li>
      <li>การมีส่วนร่วมของชุมชนในกิจกรรมดูแลต้นไม้/ทำความสะอาด</li>
    </ul>

    <p>ประชาชนสามารถตรวจสอบค่าฝุ่นแบบเรียลไทม์ได้ในเว็บไซต์หลักของเทศบาล และเสนอพื้นที่ที่อยากให้ปรับภูมิทัศน์ผ่านแบบฟอร์มออนไลน์</p>

    <figure>
      <img src="https://cdn.pixabay.com/photo/2020/09/11/00/11/landscape-5561678_1280.jpg" alt="โหนดเซ็นเซอร์ตรวจวัด PM2.5" />
      <figcaption>โหนดเซ็นเซอร์ต้นทุนต่ำที่ติดตั้งในชุมชน</figcaption>
    </figure>

    <blockquote>อากาศดีไม่ใช่เรื่องฟลุค แต่คือผลจากการออกแบบเมืองร่วมกัน</blockquote>
  `,
};

export default function Page() {
    return (
        <div className="py-6 lg:py-8">
            <NewsArticleModern item={mock} />
        </div>
    );
}
