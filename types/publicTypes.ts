export interface NewsItems {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    image: string;
    author: {
        firstname: string;
        lastname: string;
        department: string;
    };
    createdAt: string;
}

export interface NewsItem {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    image: string;
    author: {
        firstname: string;
        lastname: string;
        department: string;
        avatar: string;
        email: string
    };
    createdAt: string;
}

export interface ActivitiesItems {
    id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    author: {
        firstname: string;
        lastname: string;
        department: string;
    };
    createdAt: string;
}

export interface ActivityItem {
    id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    author: {
        firstname: string;
        lastname: string;
        department: string;
        avatar: string;
        email: string
    };
    createdAt: string;
}

export interface BannerImage {
    id: string;
    title: string;
    imageMobile: string;
    imageDesktop: string;
    isActive: Boolean;
    sortOrder: string;
    createdAt: string;
    updatedAt: string;
}

export interface BannerVideo {
    id: string;
    title: string;
    videoMobile: string;
    videoDesktop: string;
    isActive: Boolean;
    sortOrder: string;
    createdAt: string;
    updatedAt: string;
}

export interface Personnel {
    id: string;
    nameTitle: string;
    firstName: string;
    lastName: string;
    position: string;
    positionName: string;
    department: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface E_Service {
    id: string;
    title: string;
    image: String;
    linkURL: string;
    createdAt: string;
    updatedAt: string;
}

export type Banner = BannerImage | BannerVideo;
export type DataItem = Personnel | ActivitiesItems | E_Service;
