import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type Props = { searchParams: { q?: string } };

export default async function AdminSearchPage({ searchParams }: Props) {
    const q = (searchParams.q ?? '').trim();
    const like = q ? `%${q}%` : null;

    // ป้องกันยิง DB เวลา q ว่าง
    const [news, activities, personnel, eServices] = q
        ? await Promise.all([
            prisma.news.findMany({
                where: { title: { contains: q }, status: 'PUBLISHED' },
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, createdAt: true, slug: true },
            }),
            prisma.activity.findMany({
                where: { title: { contains: q }, status: 'PUBLISHED' },
                take: 10,
                orderBy: { updatedAt: 'desc' },
                select: { id: true, title: true, updatedAt: true },
            }),
            prisma.agencyPersonnel.findMany({
                where: {
                    OR: [
                        { firstName: { contains: q } },
                        { lastName: { contains: q } },
                        { positionName: { contains: q } },
                    ],
                },
                take: 10,
                orderBy: { updatedAt: 'desc' },
                select: { id: true, firstName: true, lastName: true, positionName: true },
            }),
            prisma.eService.findMany({
                where: { title: { contains: q } },
                take: 10,
                orderBy: { updatedAt: 'desc' },
                select: { id: true, title: true },
            }),
        ])
        : [[], [], [], []];

    const hasAny = [news, activities, personnel, eServices].some((a) => a.length > 0);

    return (
        <div className="mx-auto max-w-screen-xl space-y-8">
            <h1 className="text-2xl font-semibold">ผลการค้นหา{q ? `: “${q}”` : ''}</h1>

            {!q && <p className="text-sm opacity-70">พิมพ์คำค้นในช่องด้านบนแล้วกด Enter</p>}
            {!q && <Button asChild>
                <Link href={"/admin/dashboard"}>
                    <ChevronLeft />
                    แดชบอร์ด
                </Link>
            </Button>}
            {q && !hasAny && <p className="text-sm opacity-70">ไม่พบผลลัพธ์ที่ตรงกับ “{q}”</p>}

            {news.length > 0 && (
                <section>
                    <h2 className="mb-2 text-lg font-medium">ข่าวประชาสัมพันธ์</h2>
                    <ul className="divide-y rounded-md border">
                        {news.map((n) => (
                            <li key={n.id} className="px-3 py-2 hover:bg-muted">
                                <a href={`/admin/news/news-update?highlight=${encodeURIComponent(n.slug ?? n.id)}`} className="block">
                                    <div className="font-medium">{n.title}</div>
                                    <div className="text-xs opacity-70">{new Date(n.createdAt).toLocaleDateString('th-TH')}</div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {activities.length > 0 && (
                <section>
                    <h2 className="mb-2 text-lg font-medium">กิจกรรมของสำนัก</h2>
                    <ul className="divide-y rounded-md border">
                        {activities.map((a) => (
                            <li key={a.id} className="px-3 py-2 hover:bg-muted">
                                <a href={`/admin/news/activities?highlight=${a.id}`} className="block">
                                    <div className="font-medium">{a.title}</div>
                                    <div className="text-xs opacity-70">
                                        {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('th-TH') : ''}
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {personnel.length > 0 && (
                <section>
                    <h2 className="mb-2 text-lg font-medium">บุคลากร</h2>
                    <ul className="divide-y rounded-md border">
                        {personnel.map((p) => (
                            <li key={p.id} className="px-3 py-2 hover:bg-muted">
                                <a href={`/admin/agency/personnel?highlight=${p.id}`} className="block">
                                    <div className="font-medium">
                                        {p.firstName} {p.lastName}
                                    </div>
                                    <div className="text-xs opacity-70">{p.positionName ?? ''}</div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {eServices.length > 0 && (
                <section>
                    <h2 className="mb-2 text-lg font-medium">E-Service</h2>
                    <ul className="divide-y rounded-md border">
                        {eServices.map((s) => (
                            <li key={s.id} className="px-3 py-2 hover:bg-muted">
                                <a href={`/admin/e-service?highlight=${s.id}`} className="block">
                                    <div className="font-medium">{s.title}</div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
