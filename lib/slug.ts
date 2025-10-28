import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

export function makeSlugFromTitle(title: string) {
  const isThai = /[\u0E00-\u0E7F]/.test(title);
  return isThai
    ? `${title.trim().replace(/\s+/g, "-")}-${uuidv4().slice(0, 8)}`
    : slugify(title, { lower: true, strict: true });
}