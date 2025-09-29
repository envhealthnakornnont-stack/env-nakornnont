import { useState, useEffect } from "react";
import axios from "axios";
import { DataItem } from "@/types/userTypes";

export type ItemType = "Personnel" | "User" | "NewsItems" | "ActivityItems" | "E_Service";

function getItemType(item: DataItem): ItemType {
  if ("firstName" in item) {
    return "Personnel";
  } else if ("role" in item) {
    return "User";
  } else if ("author" in item) {
    if ("description" in item && item.description != null) {
      return "NewsItems";
    }
    return "ActivityItems";
  } else if ("linkURL" in item) {
    return "E_Service";
  }
  throw new Error("Unknown item type");
}

export const useDataItems = (getsApi: string) => {
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [itemType, setItemType] = useState<ItemType | null>(null);
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    const loadDataItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(getsApi);
        const dataItemsWithDate = data.map((a: any) => ({
          ...a,
          createdAt: a.createdAt && !isNaN(Date.parse(a.createdAt)) ? new Date(a.createdAt) : null,
          updatedAt: a.updatedAt && !isNaN(Date.parse(a.updatedAt)) ? new Date(a.updatedAt) : null,
        }));
        const filteredItems = dataItemsWithDate.filter((item: any) => {
          if ("role" in item) {
            return item.role === "USER";
          }
          return true;
        });
        setDataItems(filteredItems);

        if (filteredItems.length > 0) {
          const currentItemType = getItemType(filteredItems[0]);
          setItemType(currentItemType);
          switch (currentItemType) {
            case "Personnel":
              setSort("ชื่อ-นามสกุล");
              break;
            case "User":
              setSort("ผู้ใช้งาน");
              break;
            case "NewsItems":
              setSort("ชื่อข่าวสาร");
              break;
            case "ActivityItems":
              setSort("ชื่อกิจกรรม");
              break;
            case "E_Service":
              setSort("ชื่อบริการ");
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error(error);
        setError(new Error(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้"
            : "กรุณาติดต่อผู้ดูแลระบบ"
        ));
      } finally {
        setLoading(false);
      }
    };

    loadDataItems();
  }, [getsApi]);

  return { dataItems, setDataItems, loading, error, itemType, sort, setSort, getItemType };
};
