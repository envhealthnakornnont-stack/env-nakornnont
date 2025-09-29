import { useState, useEffect, useRef } from "react";
import axios from "axios";

export interface UserData {
  avatar: string;
  firstname: string;
  lastname: string;
  department: string;
  email: string;
  role: string;
}

export const useUserData = (email: string) => {
  const [userData, setUserData] = useState<UserData>({
    avatar: "",
    firstname: "",
    lastname: "",
    department: "",
    email: "",
    role: ""
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const originalAvatarRef = useRef("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/api/users/${email}`);
        const data = res.data;
        setUserData({
          avatar: data.avatar || "",
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          department: data.department || "",
          email: data.email || "",
          role: data.role || ""
        });
        originalAvatarRef.current = data.avatar || "";
        setAvatarPreview(data.avatar || "");
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchUserData();
    }
  }, [email]);

  return { userData, setUserData, loading, error, originalAvatarRef, avatarPreview, setAvatarPreview };
};
