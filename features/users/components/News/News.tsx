import NewsList from "./NewsList"
import Breadcrumbs from "@/components/Breadcrumbs";
import { NewsItems, ActivitiesItems } from "@/types/publicTypes";

interface NewsProps<T> {
    newsData: T[];
    title?: string;
    itemsPerPage?: number;
    showPagination?: boolean;
    showViewAll?: boolean;
    showBreadcrumbs?: boolean;
    viewAllLink?: string;   
    icon?: React.ReactElement;
    cardType: string;
}

const News = async <T extends NewsItems | ActivitiesItems>({ 
    newsData, 
    title, 
    itemsPerPage = 2, 
    showPagination, 
    showViewAll, 
    showBreadcrumbs = false, 
    viewAllLink, icon, 
    cardType = "type1" }: NewsProps<T>) => {
    const breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: "ข้อมูลข่าวสาร", href: "/news/news-updates" },
        { label: title, isCurrent: true },
    ];

    return (
        <div className="px-10 py-5 xl:px-20 xl:py-10">
            {showBreadcrumbs ? (
                <>
                    <Breadcrumbs items={breadcrumbs} />
                    <div className="mt-3">
                        <h1 className="sm:text-3xl text-2xl font-bold">{title}</h1>
                        <div className="flex w-full flex-col border-opacity-50">
                            <div className="divider"></div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="mt-3">
                    <h1 className="sm:text-3xl text-2xl font-bold inline-flex items-center justify-center">
                        <span className="pe-2">{icon}</span>
                        {title}
                    </h1>
                    <div className="flex w-full flex-col border-opacity-50">
                        <div className="divider"></div>
                    </div>
                </div>
            )}
            <NewsList newsData={newsData} itemsPerPage={itemsPerPage} showPagination={showPagination} showViewAll={showViewAll} viewAllLink={viewAllLink} cardType={cardType} />
        </div>
    )
}

export default News