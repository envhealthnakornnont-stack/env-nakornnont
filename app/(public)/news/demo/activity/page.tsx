import ActivityArticleModern from "@/components/News/Content/ActivityArticle/demo/ActivityArticleModern";
import type { Activity } from "@/components/News/Content/ActivityArticle/demo/types";

const mock: Activity = {
    id: "a-002",
    title: "Kick-off โครงการชุมชนสะอาด ปลอดยุงลาย เขตตลาดบางกระสอ",
    createdAt: new Date().toISOString(),
    location: "ลานกิจกรรม ตลาดบางกระสอ",
    organizer: "ฝ่ายสิ่งแวดล้อม",
    tags: ["ชุมชน", "สุขาภิบาล", "ยุงลาย", "Big Cleaning"],
    gallery: [
        { src: "https://cdn.pixabay.com/photo/2016/09/22/14/26/sweeper-1687444_1280.jpg", alt: "บรีฟงานก่อนเริ่มทำความสะอาด" },
        { src: "https://cdn.pixabay.com/photo/2020/01/13/16/56/broom-4762980_1280.jpg", alt: "ทีมงานกำจัดลูกน้ำยุงลาย" },
        { src: "https://cdn.pixabay.com/photo/2022/10/03/01/00/woman-7494708_1280.jpg", alt: "อาสาสมัครช่วยกันคัดแยกขยะ" },
        { src: "https://cdn.pixabay.com/photo/2019/08/21/09/31/monk-4420676_960_720.jpg", alt: "ล้างพื้นและทำความสะอาดรางระบายน้ำ" },
    ],
    attachments: [
        { label: "คู่มือป้องกันยุงลาย (PDF)", url: "/demo/docs/aedes-guide.pdf" },
        { label: "โปสเตอร์ Big Cleaning", url: "/demo/docs/poster.jpg" },
    ],
    // ✅ เพิ่มผู้เขียน
    author: {
        name: "นพดล ศรีสุข",
        email: "nopadol@non.go.th",
        department: "งานควบคุมโรค",
        avatar: "/demo/avatars/nopadol.jpg",
    },
    contentHtml: `
    <p>สำนักสาธารณสุขและสิ่งแวดล้อมร่วมกับชุมชนตลาดบางกระสอ เปิดโครงการ <strong>ชุมชนสะอาด ปลอดยุงลาย</strong> ด้วยกิจกรรม Big Cleaning และให้ความรู้เรื่องการกำจัดแหล่งเพาะพันธุ์ยุงลาย</p>

    <h3>กิจกรรมหลัก</h3>
    <ul>
      <li>ทำความสะอาดพื้นที่ตลาดและล้างรางระบายน้ำ</li>
      <li>สำรวจและกำจัดลูกน้ำยุงลายในภาชนะ</li>
      <li>ให้ความรู้เรื่องการคัดแยกขยะและการเก็บน้ำที่ถูกวิธี</li>
    </ul>

    <p>ประชาชนให้ความร่วมมือดีมาก โดยเฉพาะการเก็บกวาดหน้าร้านและปิดภาชนะเก็บน้ำให้มิดชิด เพื่อลดความเสี่ยงของโรคไข้เลือดออก</p>

    <blockquote>ชุมชนสะอาด เราทำได้ เริ่มจากบ้านของเราเอง</blockquote>
  `,
};

export default function Page() {
    return (
        <div className="py-6 lg:py-8">
            <ActivityArticleModern item={mock} />
        </div>
    );
}
