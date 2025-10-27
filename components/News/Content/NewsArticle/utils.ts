export const formatThaiDate = (iso: string) =>
  new Date(iso).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

export const stripHtml = (html?: string | null) =>
  (html || "").replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();

export const resolveImage = (img?: string | null) => {
  if (!img) return "/logo-nonthaburi.jpg";
  return img.startsWith("/uploads") ? `/api/uploads${img}` : img;
};

export const estimateReadingMinutes = (html: string) => {
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 250)); // 250 wpm
  return mins;
};