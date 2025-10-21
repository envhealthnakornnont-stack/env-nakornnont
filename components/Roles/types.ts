export type KPI = { label: string; value: string; hint?: string };
export type DownloadItem = { name: string; href: string; size?: string; updatedAt?: string };

export type RolesPageData = {
    title: string;
    subtitle?: string;
    hero: { badge?: string; };
    kpis?: KPI[];
    downloads?: DownloadItem[];
};