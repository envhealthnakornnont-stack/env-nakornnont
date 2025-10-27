export const formatThaiDateTime = (iso: string) =>
  new Date(iso).toLocaleString("th-TH", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const resolveUpload = (src: string) => (src?.startsWith("/uploads") ? `/api/uploads${src}` : src);
