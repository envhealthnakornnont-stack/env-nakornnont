import type { Metadata } from "next";
import PolicyLayout from "@/components/policy/policy-layout";

export const metadata: Metadata = {
  title: "การเข้าถึง (Accessibility)",
  description: "ถ้อยแถลงด้านการเข้าถึงเว็บและแนวทางปรับปรุงเพื่อผู้ใช้ทุกกลุ่ม",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <PolicyLayout title="การเข้าถึง (Accessibility)" updatedAt="2025-10-14">
      <h2>พันธกิจด้านการเข้าถึง</h2>
      <p>
        เรามุ่งมั่นให้บริการออนไลน์ที่เข้าถึงได้แก่ผู้ใช้ทุกคน ตามแนวทาง WCAG 2.2 ระดับ AA
        และยึดตามมาตรฐานราชการไทยที่เกี่ยวข้อง
      </p>

      <h2>สิ่งที่เราดำเนินการ</h2>
      <ul>
        <li>รองรับคีย์บอร์ดเต็มรูปแบบและลำดับโฟกัสที่คาดเดาได้</li>
        <li>คอนทราสต์สีและขนาดตัวอักษรที่เหมาะสม พร้อมโหมดลดแอนิเมชัน</li>
        <li>มีชื่อ/คำอธิบายสำหรับองค์ประกอบแบบฟอร์มและรูปภาพสำคัญ</li>
        <li>โครงสร้างหัวข้อที่สื่อความหมาย (H1–H2…)</li>
      </ul>

      <h2>ประเด็นที่ยังต้องปรับปรุง</h2>
      <ul>
        <li>ไฟล์แนบบางส่วนยังไม่มีคำอธิบายทางเลือก</li>
        <li>เนื้อหาจากแหล่งภายนอกอาจไม่เป็นไปตามมาตรฐานทั้งหมด</li>
      </ul>

      <h2>ข้อเสนอแนะ/รายงานปัญหา</h2>
      <p>
        หากพบอุปสรรคในการใช้งาน โปรดแจ้งผ่าน <a href="/contact">หน้าแบบฟอร์มติดต่อ</a>
        หรืออีเมล <span className="whitespace-nowrap">Env.health.nakornnont@gmail.com</span>
      </p>
    </PolicyLayout>
  );
}
