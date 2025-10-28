export type ActivityAuthor = {
  name: string;
  email?: string | null;
  department?: string | null;
  avatar?: string | null;
};

export type Activity = {
  id: string | number;
  title: string;
  createdAt: string;              // ISO
  location?: string | null;
  organizer?: string | null;
  gallery?: { src: string; alt?: string }[];
  contentHtml: string;
  tags?: string[];
  attachments?: { label: string; url: string }[];

  // ✅ เพิ่มผู้เขียน
  author?: ActivityAuthor | null;
};