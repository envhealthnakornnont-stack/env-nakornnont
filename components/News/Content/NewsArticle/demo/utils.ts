export const formatThaiDate = (iso: string) =>
  new Date(iso).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

export const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

export const readMins = (html: string) => Math.max(1, Math.round(stripHtml(html).split(/\s+/).length / 250));

export const resolveImage = (src?: string) => {
  if (!src) return "/logo-nonthaburi.jpg";
  return src.startsWith("/uploads") ? `/api/uploads${src}` : src;
};
