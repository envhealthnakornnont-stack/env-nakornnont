import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Received data from client:", data);

    // ตั้งค่า Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // หรือใช้ SMTP Server อื่น
      auth: {
        user: "phetangelb123@gmail.com", // อีเมลผู้ส่ง (เก็บไว้ใน .env)
        pass: "xheg xnvz rxul sxhh", // รหัสผ่าน/แอปพาสเวิร์ด (เก็บไว้ใน .env)
      },
    });

    // ตั้งค่าเนื้อหาอีเมล
    const mailOptions = {
      from: "phetangelb123@gmail.com", // อีเมลผู้ส่ง
      to: "phetangelb@gmail.com", // อีเมลผู้รับ (สามารถปรับให้เป็นค่าจาก `data`)
      subject: `Contact Form Submission: ${data.fullName}`, // หัวข้ออีเมล
      text: `
          Name: ${data.fullName}
          Address: ${data.address}
          Phone: ${data.phone}
          Email: ${data.email}
          Details: ${data.details}
      `,
    };

    // ส่งอีเมล
    const emailResponse = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", emailResponse);

    return NextResponse.json({ message: "Data received successfully", data }, { status: 200 });

  } catch (error) {
    console.error("Email error:", error);

    return NextResponse.json({ message: "Failed to process data" }, { status: 500 });
  }

}