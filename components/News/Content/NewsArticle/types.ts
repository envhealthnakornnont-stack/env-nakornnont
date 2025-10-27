export type Author = {
  firstname: string;
  lastname: string;
  department?: string | null;
  avatar?: string | null;
  email?: string | null;
};

export type NewsArticle = {
  id: string | number;
  title: string;
  slug?: string | null;
  image?: string | null;          // hero image
  description?: string | null;    // meta desc (stripped)
  content: string;                // HTML
  tags?: string[];                // optional
  createdAt: string;              // ISO
  author: Author;
  attachments?: { label: string; url: string }[];
};