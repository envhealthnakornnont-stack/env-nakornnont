export type RelatedItem = {
  id: string | number;
  title: string;
  href: string;
  image?: string | null;
  tags?: string[];      // ใช้ slug หรือ name ก็ได้ แต่ควรเป็น slug จะนิ่งกว่า
  createdAt?: string;   // ISO
  subtitle?: string;    // eg. department/organizer
};

export type ApiListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};