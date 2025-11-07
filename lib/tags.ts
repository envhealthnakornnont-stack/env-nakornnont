import prisma from "@/lib/prisma";

export async function connectOrCreateTags(tagNames: string[]) {
    const unique = Array.from(new Set(tagNames.map(t => t.trim()).filter(Boolean)));
    if (unique.length === 0) return { connect: [] as { id: string }[] };

    // สร้าง slug ง่าย ๆ
    const items = await Promise.all(
        unique.map(async (name) => {
            const slug = name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-ก-๙]/gi, "");
            const tag = await prisma.tag.upsert({
                where: { slug },
                create: { name, slug },
                update: { name },
                select: { id: true },
            });
            return { id: tag.id };
        })
    );
    return { connect: items };
}