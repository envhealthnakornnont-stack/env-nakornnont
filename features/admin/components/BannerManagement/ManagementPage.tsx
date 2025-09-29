"use client"
import axios from "axios";
import Image from "next/image"
import Link from "next/link";
import SearchBar from "@/features/admin/components/BannerManagement/SearchBar"
import SortDropdown from "@/features/admin/components/BannerManagement/SortDropdown"
import BannerGrid from "@/features/admin/components/BannerManagement/BannerGrid"
import { useState, useEffect, useMemo } from 'react';
import { Info } from "lucide-react";

interface BannerImage {
    id: string;
    title: string;
    imageMobile: string;
    imageDesktop: string;
    isActive: boolean;
    sortOrder: string;
    createdAt: string;
    updatedAt: string;
}

interface BannerVideo {
    id: string;
    title: string;
    videoMobile: string;
    videoDesktop: string;
    isActive: boolean;
    sortOrder: string;
    createdAt: string;
    updatedAt: string;
}

type Banner = BannerImage | BannerVideo;

const ManagementPage = ({ management, getsApi, createLink, editLink, deleteApi }: { management?: string, getsApi: string, createLink: string, editLink: string, deleteApi: string }) => {

    // กำหนด type ให้กับ state variables
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sort, setSort] = useState<string>("ลำดับแบนเนอร์");

    useEffect(() => {
        const loadBanner = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get(`${getsApi}`);
                const bannerWithDate = data.map((a: any) => ({
                    ...a,
                    createdAt: a.createdAt && !isNaN(Date.parse(a.createdAt)) ? new Date(a.createdAt) : null,
                    updatedAt: a.updatedAt && !isNaN(Date.parse(a.updatedAt)) ? new Date(a.updatedAt) : null,
                }));
                setBanners(bannerWithDate);
            } catch (error) {
                console.log(error);
                setError(new Error(axios.isAxiosError(error) ? error.response?.data?.message || "Failed to fetch Banner Image" : "An unexpected error occurred"));
            } finally {
                setLoading(false);
            }
        };

        loadBanner();
    }, []);

    // ใช้ useEffect เพื่อ filter ข้อมูลตาม searchQuery เมื่อ users หรือ searchQuery เปลี่ยนแปลง
    const filteredBanner = useMemo(() => {
        return banners.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [banners, searchQuery]);

    // ฟังก์ชันเรียงลำดับข้อมูลผู้ใช้งานตามตัวเลือก
    const sortedFilteredBanner = useMemo(() => {
        let sorted = [...filteredBanner];

        switch (sort) {
            case "ชื่อแบนเนอร์":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "ลำดับแบนเนอร์":
                sorted.sort((a, b) => (String(a.sortOrder)).localeCompare(String(b.sortOrder)));
                break;
            case "วันที่อัปเดต":
                sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
                break;
        }

        return sorted;
    }, [filteredBanner, sort]);

    const handleSort = (option: string) => {
        setSort(option);
    };

    // ฟังก์ชันรับ query จาก SearchBar
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    if (loading) {
        return (
            <div className="m-3 p-2 sm:m-3 sm:p-3 lg:m-4 lg:p-3 xl:m-5 xl:p-5 flex flex-col h-[calc(100vh-106px)] bg-base-100 rounded-lg shadow">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                        <div className="skeleton h-8 lg:h-12 w-[154px] md:w-[201px] lg:w-[296px] rounded-lg"></div>
                        <div className="skeleton h-8 lg:h-12 w-[105px] lg:w-[168px] rounded-lg m-1 md:mx-3"></div>
                    </div>
                    <div className="skeleton h-8 lg:h-12 w-[38px] lg:w-[117px] rounded-lg"></div>
                </div>
                <div className="overflow-x-auto mt-6 grow">
                    <div className="skeleton h-full w-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-66px)]">
                <div className="text-center p-6 bg-base-100 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-error mb-4">Error</h1>
                    <p className="text-lg mb-4">เกิดข้อผิดพลาด: {error.message}</p>
                    <Image src={`/undraw_not-found_6bgl.svg`} alt="Error เกิดข้อผิดพลาด" width={300} height={300} />
                    <Link href={`/admin/dashboard`} className="btn btn-primary my-4">ไปยังหน้าแดชบอร์ด</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="m-3 p-2 sm:m-3 sm:p-3 lg:m-4 lg:p-3 xl:m-5 xl:p-5 flex flex-col bg-base-100 rounded-lg shadow">
            <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                    <SearchBar onSearch={handleSearch} />
                    <SortDropdown onSort={handleSort} />
                </div>
            </div>
            <div role="alert" className="alert alert-info text-sm mt-3">
                <Info size={22} />
                <p>
                    ไม่สามารถเปิดใช้งานสถานะ {" "}
                    <span className="font-bold underline">แสดงแบนเนอร์</span> มากกว่า 1 รายการได้
                </p>
            </div>
            <div className="overflow-x-auto mt-6 grow">
                <BannerGrid management={management} banners={sortedFilteredBanner} createLink={createLink} editLink={editLink} deleteApi={deleteApi} />
            </div>
        </div>
    )
}

export default ManagementPage