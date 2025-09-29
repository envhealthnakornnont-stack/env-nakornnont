"use client";

import CreateButton from "@/features/admin/components/Management/CreateButton";
import SearchBar from "@/features/admin/components/Management/SearchBar";
import SortDropdown from "@/features/admin/components/Management/SortDropdown";
import Table from "@/features/admin/components/Management/Table";
import { useState, useMemo, useEffect } from "react";
import { DataItem, User, PersonnelItems, NewsItems, ActivityItems, E_ServiceItems } from "@/types/userTypes";
import Image from "next/image";
import Link from "next/link";
import { useDataItems, ItemType } from "@/features/admin/hooks/ManagementPage/useDataItems";
import Pagination from "@/components/Pagination";

const ManagementPage = ({
  getsApi,
  createLink,
  editLink,
  deleteApi,
}: {
  getsApi: string;
  createLink: string;
  editLink: string;
  deleteApi: string;
}) => {
  const { dataItems, setDataItems, loading, error, itemType, sort, setSort } = useDataItems(getsApi);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // กำหนด filter configuration ตาม itemType
  const filterConfig: { [key in ItemType]: string[] } = {
    Personnel: ["firstName", "lastName", "position", "positionName", "department"],
    User: ["firstname", "lastname", "email", "department"],
    NewsItems: ["title", "author.firstname", "author.department"],
    ActivityItems: ["title", "author.firstname", "author.department"],
    E_Service: ["title", "linkURL"],
  };

  const getNestedValue = (obj: any, key: string): string => {
    return key.split(".").reduce((o, k) => (o ? o[k] : ""), obj) || "";
  };

  const filteredDataItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return dataItems.filter((item) => {
      // ตรวจสอบประเภทของ item จาก custom hook getItemType
      const type: ItemType = itemType ? itemType : "Personnel"; // ใช้ Personnel เป็นค่า default ถ้าไม่ได้กำหนด
      const fields = filterConfig[type] || [];
      return fields.some((field) => {
        const fieldValue = getNestedValue(item, field).toString().toLowerCase();
        return fieldValue.includes(query);
      });
    });
  }, [dataItems, searchQuery, itemType, filterConfig]);

  const sortingConfig: {
    [key in ItemType]: {
      [option: string]: (a: DataItem, b: DataItem) => number;
    };
  } = {
    Personnel: {
      "ชื่อ-นามสกุล": (a, b) => {
        const nameA = (a as PersonnelItems).firstName + " " + (a as PersonnelItems).lastName;
        const nameB = (b as PersonnelItems).firstName + " " + (b as PersonnelItems).lastName;
        return nameA.localeCompare(nameB);
      },
      "ตำแหน่ง": (a, b) =>
        (a as PersonnelItems).position.localeCompare((b as PersonnelItems).position),
      "ชื่อตำแหน่ง": (a, b) =>
        (a as PersonnelItems).positionName.localeCompare((b as PersonnelItems).positionName),
      "ส่วนงาน": (a, b) =>
        (a as PersonnelItems).department.localeCompare((b as PersonnelItems).department),
      "วันที่สร้าง": (a, b) =>
        new Date((a as PersonnelItems).createdAt).getTime() - new Date((b as PersonnelItems).createdAt).getTime(),
      "วันที่อัปเดต": (a, b) =>
        new Date((a as PersonnelItems).updatedAt).getTime() - new Date((b as PersonnelItems).updatedAt).getTime(),
    },
    User: {
      "ผู้ใช้งาน": (a, b) =>
        (a as User).email.localeCompare((b as User).email),
      "ส่วนงาน": (a, b) =>
        ((a as User).department || "").localeCompare(((b as User).department || "")),
      "วันที่สร้าง": (a, b) =>
        new Date((a as User).createdAt).getTime() - new Date((b as User).createdAt).getTime(),
      "วันที่อัปเดต": (a, b) =>
        new Date((a as User).updatedAt).getTime() - new Date((b as User).updatedAt).getTime(),
    },
    NewsItems: {
      "ชื่อข่าวสาร": (a, b) =>
        (a as NewsItems).title.localeCompare((b as NewsItems).title),
      "ผู้เขียน": (a, b) =>
        (a as NewsItems).author.firstname.localeCompare((b as NewsItems).author.firstname),
      "ส่วนงาน": (a, b) =>
        (a as NewsItems).author.department.localeCompare((b as NewsItems).author.department),
      "วันที่สร้าง": (a, b) =>
        new Date((a as NewsItems).createdAt).getTime() - new Date((b as NewsItems).createdAt).getTime(),
      "วันที่อัปเดต": (a, b) =>
        new Date((a as NewsItems).updatedAt).getTime() - new Date((b as NewsItems).updatedAt).getTime(),
    },
    ActivityItems: {
      "ชื่อกิจกรรม": (a, b) =>
        (a as ActivityItems).title.localeCompare((b as ActivityItems).title),
      "ผู้เขียน": (a, b) =>
        (a as ActivityItems).author.firstname.localeCompare((b as ActivityItems).author.firstname),
      "ส่วนงาน": (a, b) =>
        (a as ActivityItems).author.department.localeCompare((b as ActivityItems).author.department),
      "วันที่สร้าง": (a, b) =>
        new Date((a as ActivityItems).createdAt).getTime() - new Date((b as ActivityItems).createdAt).getTime(),
      "วันที่อัปเดต": (a, b) =>
        new Date((a as ActivityItems).updatedAt).getTime() - new Date((b as ActivityItems).updatedAt).getTime(),
    },
    E_Service: {
      "ชื่อบริการ": (a, b) =>
        (a as E_ServiceItems).title.localeCompare((b as E_ServiceItems).title),
      "วันที่สร้าง": (a, b) =>
        new Date((a as E_ServiceItems).createdAt).getTime() - new Date((b as E_ServiceItems).createdAt).getTime(),
      "วันที่อัปเดต": (a, b) =>
        new Date((a as E_ServiceItems).updatedAt).getTime() - new Date((b as E_ServiceItems).updatedAt).getTime(),
    },
  };

  const sortedFilteredDataItems = useMemo(() => {
    const sorted = [...filteredDataItems];
    if (sorted.length === 0) return sorted;
    const type: ItemType = itemType ? itemType : "Personnel";
    const comparator = sortingConfig[type][sort];
    if (comparator) {
      sorted.sort(comparator);
    } else {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return sorted;
  }, [filteredDataItems, sort, itemType, sortingConfig]);

  // คำนวณตัวเลขสรุป
  const total = sortedFilteredDataItems.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  // ถ้า currentPage เกินหน้า ให้ปรับลงมา
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // reset หน้าเมื่อ search/sort/type เปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sort, itemType]);

  // คำนวณ pagedItems
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedFilteredDataItems.slice(start, start + itemsPerPage);
  }, [sortedFilteredDataItems, currentPage]);

  // คำนวณ startIndex/endIndex
  const startIndex = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, total);

  const handleSort = (option: string) => {
    setSort(option);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="m-3 p-2 sm:m-3 sm:p-3 lg:m-4 lg:p-3 xl:m-5 xl:p-5 flex flex-col h-[calc(100vh-106px)] bg-base-100 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
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
    <div className="m-3 p-2 sm:m-3 sm:p-3 lg:m-4 lg:p-3 xl:m-5 xl:p-5 flex flex-col h-[calc(100vh-106px)] bg-base-100 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SearchBar onSearch={handleSearch} />
          <SortDropdown onSort={handleSort} itemType={itemType} />
        </div>
        <CreateButton createLink={createLink} itemType={itemType} />
      </div>
      <div className="overflow-x-auto overflow-y-hidden mt-6 grow">
        <Table dataItem={pagedItems} setDataItems={setDataItems} ItemType={itemType} sort={sort} editLink={editLink} deleteApi={deleteApi} />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-sm px-4">
          {total > 0
            ? `กำลังแสดง ${startIndex} ถึง ${endIndex} จาก ${total} รายการ`
            : "ไม่มีรายการให้แสดง"}
        </div>
        <div className="px-4 py-6">
          <Pagination
            currentPage={currentPage}
            totalItems={sortedFilteredDataItems.length}
            itemsPerPage={itemsPerPage}
            onPageChange={page => setCurrentPage(page)}
            siblingCount={1}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
