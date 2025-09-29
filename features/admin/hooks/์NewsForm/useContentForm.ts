// features/admin/hooks/useContentForm.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { validateContentForm } from "../../utils/NewsForm/validation";

interface Params {
  type: "activity" | "news";
  apiEndpoint: string;
  redirectPath: string;
}

export function useContentForm({ type, apiEndpoint, redirectPath }: Params) {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [htmlContent, setHtmlContent] = useState("<p></p>");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (content: string) => {
    setHtmlContent(content);
  }

  const submit = async (imageFile: File | null) => {
    const errs = validateContentForm({ type, title, detail, htmlContent, imageFile });
    console.log(errs);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return false;
    }
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    if (type === "news") formData.append("detail", detail);
    formData.append("htmlContent", htmlContent);
    formData.append("authorId", String(session?.user.id));
    if (imageFile) formData.append("coverImage", imageFile);

    try {
      await axios.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage("บันทึกข้อมูลสำเร็จ!");
      router.push(redirectPath);
      return true;
    } catch {
      setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    // state
    title, setTitle,
    detail, setDetail,
    htmlContent, setHtmlContent,
    errors, message, setMessage, isSubmitting,
    // action
    onChange, submit
  };
}
