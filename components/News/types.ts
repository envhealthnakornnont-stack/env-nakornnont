export type Newsish = {
    id: string;
    title: string;
    slug: string;
    image?: string | null;
    description?: string | null;
    content?: any; // Quill Delta หรือ HTML string
    author?: { firstname?: string; lastname?: string; department?: string };
    createdAt: string;
    createdAtISO?: string;
};

export type Crumb = { label: string; href?: string; current?: boolean };

export type NewsGridMode = "home" | "index";

export type NewsType = "news" | "activities";

export type NewsGridProps = {
    /** โหมดการแสดงผล: หน้าแรก(home) หรือ หน้ารวม(index) */
    mode: NewsGridMode;

    /** ชนิดข่าวเพื่อป้าย badge และสร้างลิงก์ */
    type: NewsType;

    /** รายการที่จะแสดง */
    items: Newsish[];

    /** ชื่อหัวข้อส่วน */
    title?: string;

    /** ใช้เฉพาะ mode="home" */
    viewAllHref?: string;
    maxCards?: number;

    /** ใช้เฉพาะ mode="index" */
    basePath?: string;             // เช่น "/news/news-updates" หรือ "/news/activities"
    defaultPerPage?: number;       // 9 | 12 | 18 ...
    breadcrumbs?: Crumb[];

    /** className เพิ่มเติม */
    className?: string;
};