export type ApiTag = {
    slug?: string | null;
    name?: string | null;
};

export type ApiAuthor = {
    firstname?: string | null;
    lastname?: string | null;
    department?: string | null;
    email?: string | null;
    avatar?: string | null; // อาจเป็น /uploads หรือ URL เต็ม
};

export type ApiAttachment = {
    label: string;
    url: string;
};

export type ApiNewsItem = {
    id: string;
    title: string;
    image?: string | null;
    heroCredit?: string | null;
    contentHtml?: string | null;
    createdAt?: string | null;
    tags?: ApiTag[] | null;
    author?: ApiAuthor | null;
    attachments?: ApiAttachment[] | null;
};

export type ApiActivityGalleryItem = {
    src?: string | null;
    alt?: string | null;
};

export type ApiActivityItem = {
    id: string;
    title: string;
    createdAt?: string | null;
    location?: string | null;
    organizer?: string | null;
    gallery?: ApiActivityGalleryItem[] | null;
    contentHtml?: string | null;
    tags?: ApiTag[] | null;
    attachments?: ApiAttachment[] | null;
    author?: ApiAuthor | null;
    // กรณีดึงไปสร้าง related
    cover?: string | null;
    department?: string | null;
};