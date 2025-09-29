"use client";

import { NewsItems, ActivitiesItems } from "@/types/publicTypes";

// React hook
import { useState } from "react";

// Component
import Link from "next/link";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";

interface NewsListProps<T> {
    newsData: T[];
    itemsPerPage: number;
    showPagination?: boolean;
    showViewAll?: boolean;
    viewAllLink?: string;
    cardType:string
}

const NewsList = <T extends NewsItems | ActivitiesItems> ({ 
    newsData, 
    itemsPerPage, 
    showPagination, 
    showViewAll, 
    viewAllLink, 
    cardType}: NewsListProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedNews = newsData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 lg:gap-9 mb-3">
                {paginatedNews.map((news) => (
                    <Card
                        key={String(news.id)}
                        news={news}
                        cardType={cardType}
                    />
                ))}
            </div>
            {showPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={newsData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
            {showViewAll && (
                <div className="flex justify-center">
                    <Link href={viewAllLink || ""} className="btn btn-secondary my-6">ดูทั้งหมด</Link>
                </div>
            )}
        </>
    )
}

export default NewsList