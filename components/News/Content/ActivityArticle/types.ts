export type ActivityArticle = {
  id: string | number;
  title: string;
  content: string;            // HTML
  createdAt: string;          // ISO
  location?: string | null;
  organizer?: string | null;  // แผนก/หน่วยงาน
  gallery?: { src: string; alt?: string }[];
  attachments?: { label: string; url: string }[];
  tags?: string[];
};
