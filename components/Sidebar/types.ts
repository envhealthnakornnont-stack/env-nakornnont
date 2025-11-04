export type Role = "USER" | "SUPERUSER";

export type AdminUser = {
  id: string;
  name: string;
  email?: string;
  role: Role;
  avatar?: string;
};