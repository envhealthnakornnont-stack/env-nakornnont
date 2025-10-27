export type EServiceItem = {
  id: string;
  title: string;
  linkURL: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Crumb = { label: string; href?: string; current?: boolean };
