import bcrypt from "bcrypt";

async function hashPassword(password:any) {
    try {
        const saltRounds = 10; // จำนวน Salt Rounds (ความซับซ้อนในการ Hash)
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        console.log("Bcrypt Hash:", hash); // แสดงผลลัพธ์ Hash ใน Console
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
        return null;
    }
}

export default hashPassword