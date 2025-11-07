import type { Personnel, Mgmt } from "./types";

export const resolveLevel = (positionText: string): 1 | 2 | 3 | 0 => {
  if (/ผู้อำนวยการสำนัก/i.test(positionText)) return 1;
  if (/ผู้อำนวยการส่วน/i.test(positionText)) return 2;
  if (/หัวหน้าฝ่าย/i.test(positionText)) return 3;
  return 0;
};

export const resolveImagePath = (img?: string | null): string => !img ? "/person_picture.png" : img.startsWith("/uploads") ? `/api/uploads${img}` : img;

export const isMgmt = (x: Personnel | Mgmt): x is Mgmt => {
  const m = x as Partial<Mgmt>;
  return (
    typeof m.level === "number" &&
    typeof m.fullName === "string" &&
    typeof m.imageResolved === "string"
  );
};

export const toMgmt = (p: Personnel | Mgmt): Mgmt => {
  if (isMgmt(p)) {
    const positionText = p.positionName ?? p.position ?? "";
    return {
      ...p,
      level: (p.level ?? resolveLevel(positionText)) as 1 | 2 | 3,
      fullName:
        p.fullName ??
        `${p.nameTitle ?? ""}${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
      imageResolved: p.imageResolved ?? resolveImagePath(p.image),
      departmentLabel:
        p.departmentLabel ?? p.departmentName ?? p.divisionName ?? null,
    };
  }

  const positionText = p.positionName ?? p.position ?? "";
  const level = resolveLevel(positionText);
  return {
    ...p,
    level: (level === 1 || level === 2 || level === 3 ? level : 1) as 1 | 2 | 3,
    fullName: `${p.nameTitle ?? ""}${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
    imageResolved: resolveImagePath(p.image),
    departmentLabel: p.departmentName ?? p.divisionName ?? null,
  };
};