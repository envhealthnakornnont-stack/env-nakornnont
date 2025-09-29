"use client";
import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import ChartCard from "./ChartCard";
import RecentList from "./RecentList";
import QuickLinks from "./QuickLinks";
import {
    Users,
    ShieldCheck,
    User,
    Image,
    Newspaper,
    CalendarCheck,
} from "lucide-react";

interface DashboardProps {
    role: "SUPERUSER" | "USER";
    email: string;
}

const getLastMonthLabels = (count = 5): string[] => {
    const now = new Date();
    const monthNames = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const labels: string[] = [];

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = monthNames[date.getMonth()];
        const year = (date.getFullYear() + 543).toString().slice(-2);
        labels.push(`${month} ${year}`);
    }

    return labels;
};

const countByMonth = (items: any[], key: string, labels: string[]): number[] => {
    const monthNames = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    return labels.map(label => {
        const [monthLabel, year] = label.split(" ");
        const monthIndex = monthNames.indexOf(monthLabel);
        return items.filter(item => {
            const d = new Date(item[key]);
            const thYear = (d.getFullYear() + 543).toString().slice(-2);
            return d.getMonth() === monthIndex && thYear === year;
        }).length;
    });
};

const Dashboard = ({ role, email }: DashboardProps) => {
    const isSuperuser = role === "SUPERUSER";

    const [summary, setSummary] = useState({
        totalUsers: 0,
        totalSuperusers: 0,
        totalRegularUsers: 0,
        totalNews: 0,
        totalActivities: 0,
        totalEServices: 0,
        totalVideoBanners: 0,
        totalImageBanners: 0,
        totalPersonnel: 0,
        activeBanners: 0,
    });

    const [userData, setUserData] = useState<{
        news: number;
        activities: number;
        updated: any[];
        statsByMonth: {
            categories: string[];
            news: number[];
            activities: number[];
        };
    }>({
        news: 0,
        activities: 0,
        updated: [],
        statsByMonth: {
            categories: [],
            news: [],
            activities: [],
        },
    });

    const [trendData, setTrendData] = useState<{
        categories: string[];
        news: number[];
        activities: number[];
    }>({
        categories: [],
        news: [],
        activities: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    news,
                    activities,
                    eservice,
                    video,
                    image,
                    personnel,
                    currentUser,
                ] = await Promise.all([
                    fetch("/api/news").then(res => res.json()),
                    fetch("/api/activities").then(res => res.json()),
                    fetch("/api/eservice").then(res => res.json()),
                    fetch("/api/banner/video").then(res => res.json()),
                    fetch("/api/banner/image").then(res => res.json()),
                    fetch("/api/agency/personnel").then(res => res.json()),
                    fetch(`/api/users/${email}`).then(res => res.json()),
                ]);

                const totalVideoBanners = video.length || 0;
                const totalImageBanners = image.length || 0;
                const activeBanners = [...video, ...image].filter((b: any) => b.isActive).length;

                const baseSummary = {
                    totalNews: news.length,
                    totalActivities: activities.length,
                    totalEServices: eservice.length,
                    totalVideoBanners,
                    totalImageBanners,
                    totalPersonnel: personnel.length,
                    activeBanners,
                    totalUsers: 0,
                    totalSuperusers: 0,
                    totalRegularUsers: 0,
                };

                const monthLabels = getLastMonthLabels();

                setTrendData({
                    categories: monthLabels,
                    news: countByMonth(news, "createdAt", monthLabels),
                    activities: countByMonth(activities, "createdAt", monthLabels),
                });

                if (isSuperuser) {
                    try {
                        const usersRes = await fetch("/api/users");
                        const usersData = await usersRes.json();
                        const users = Array.isArray(usersData) ? usersData : usersData.users ?? [];

                        setSummary({
                            ...baseSummary,
                            totalUsers: users.length,
                            totalSuperusers: users.filter((u: any) => u.role === "SUPERUSER").length,
                            totalRegularUsers: users.filter((u: any) => u.role === "USER").length,
                        });
                    } catch (err) {
                        console.error("ไม่สามารถโหลดข้อมูลผู้ใช้ทั้งหมดได้:", err);
                        setSummary(baseSummary);
                    }
                } else {
                    setSummary(baseSummary);
                }

                setUserData({
                    news: currentUser.news?.length ?? 0,
                    activities: currentUser.activities?.length ?? 0,
                    updated: (currentUser.updated ?? []).slice(0, 5),
                    statsByMonth: {
                        categories: monthLabels,
                        news: countByMonth(currentUser.news ?? [], "createdAt", monthLabels),
                        activities: countByMonth(currentUser.activities ?? [], "createdAt", monthLabels),
                    },
                });
            } catch (err) {
                console.error("เกิดข้อผิดพลาดระหว่างโหลดข้อมูล Dashboard:", err);
            }
        };

        fetchData();
    }, [email, role]);

    return (
        <div className="grid gap-6 p-4 lg:p-6 xl:p-10">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(isSuperuser
                    ? [
                        {
                            label: "ผู้ใช้งานทั้งหมด",
                            value: summary.totalUsers,
                            icon: <Users className="w-6 h-6 text-primary" />,
                        },
                        {
                            label: "SUPERUSER",
                            value: summary.totalSuperusers,
                            icon: <ShieldCheck className="w-6 h-6 text-secondary" />,
                        },
                        {
                            label: "USER ทั่วไป",
                            value: summary.totalRegularUsers,
                            icon: <User className="w-6 h-6 text-info" />,
                        },
                        {
                            label: "แบนเนอร์ที่ใช้งาน",
                            value: summary.activeBanners,
                            icon: <Image className="w-6 h-6 text-accent" />,
                        },
                    ]
                    : [
                        {
                            label: "ข่าวของคุณ",
                            value: userData.news,
                            icon: <Newspaper className="w-6 h-6 text-primary" />,
                        },
                        {
                            label: "กิจกรรมของคุณ",
                            value: userData.activities,
                            icon: <CalendarCheck className="w-6 h-6 text-secondary" />,
                        },
                    ]
                ).map((item, idx) => (
                    <SummaryCard key={idx} label={item.label} value={item.value} icon={item.icon} />
                ))}
            </div>

            {isSuperuser && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <ChartCard
                        title="ภาพรวมหมวดหมู่"
                        type="bar"
                        series={[{
                            name: "จำนวน",
                            data: [
                                summary.totalNews,
                                summary.totalActivities,
                                summary.totalEServices,
                                summary.totalVideoBanners,
                                summary.totalImageBanners,
                                summary.totalPersonnel,
                            ],
                        }]}
                        options={{
                            chart: { id: "content-stats" },
                            xaxis: {
                                categories: ["ข่าว", "กิจกรรม", "E-Service", "แบนเนอร์วิดีโอ", "แบนเนอร์ภาพ", "บุคลากร"],
                            },
                            colors: ["oklch(var(--p))"],
                        }}
                    />

                    <ChartCard
                        title="แนวโน้มเนื้อหา"
                        type="line"
                        series={[
                            { name: "ข่าว", data: trendData.news },
                            { name: "กิจกรรม", data: trendData.activities },
                        ]}
                        options={{
                            chart: { id: "trend-line" },
                            xaxis: { categories: trendData.categories },
                            stroke: { curve: "smooth" },
                            colors: ["oklch(var(--p))", "oklch(var(--a))"],
                        }}
                    />

                    <ChartCard
                        title="สถานะแบนเนอร์"
                        type="donut"
                        series={[
                            summary.activeBanners,
                            summary.totalVideoBanners + summary.totalImageBanners - summary.activeBanners,
                        ]}
                        options={{
                            labels: ["ทำงาน", "ไม่ทำงาน"],
                            colors: ["oklch(var(--su))", "oklch(var(--wa))"],
                        }}
                    />
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(isSuperuser
                    ? [
                        {
                            label: "ข่าวของคุณ",
                            value: userData.news,
                            icon: <Newspaper className="w-6 h-6 text-primary" />,
                        },
                        {
                            label: "กิจกรรมของคุณ",
                            value: userData.activities,
                            icon: <CalendarCheck className="w-6 h-6 text-secondary" />,
                        },
                    ]
                    : []
                ).map((item, idx) => (
                    <SummaryCard key={idx} label={item.label} value={item.value} icon={item.icon} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard
                    title="แนวโน้มเนื้อหาของคุณ"
                    type="line"
                    series={[
                        { name: "ข่าว", data: userData.statsByMonth.news },
                        { name: "กิจกรรม", data: userData.statsByMonth.activities },
                    ]}
                    options={{
                        chart: { id: "user-trend" },
                        xaxis: { categories: userData.statsByMonth.categories },
                        stroke: { curve: "smooth" },
                        colors: ["oklch(var(--p))", "oklch(var(--a))"]
                    }}
                />

                <RecentList items={userData.updated} />
            </div>
            <QuickLinks />
        </div>
    );
};

export default Dashboard;