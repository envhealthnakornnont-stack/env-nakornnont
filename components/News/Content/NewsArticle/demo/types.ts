export type Author = {
  name: string;
  department?: string | null;
  email?: string | null;
  avatar?: string | null;
};

export type NewsArticle = {
  id: string | number;
  title: string;
  hero?: { src: string; alt?: string; credit?: string; };
  contentHtml: string;
  createdAt: string;      // ISO
  tags?: string[];
  author: Author;
  attachments?: { label: string; url: string }[];
};
