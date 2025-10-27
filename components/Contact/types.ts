export type Phone = { label: string; value: string };
export type ContactPoint = {
  title: string;
  address: string;
  email?: string;
  phones?: Phone[];
  logoSrc?: string;
  mapsEmbedUrl: string;
  mapsLinkUrl: string;
};
