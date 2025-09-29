import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  debounceTime?: number;
}

const SearchBar = ({ onSearch, debounceTime = 500 }:SearchBarProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ใช้ useEffect เพื่อ debounce เมื่อ query เปลี่ยนแปลง
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, debounceTime, onSearch]);

  // ใช้ hotkey ctrl+k เพื่อ focus ช่องค้นหา
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ตรวจสอบว่ามีการกด ctrl + K
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault(); // ป้องกัน hotkey ที่เป็นค่าเริ่มต้น (เช่น refresh หรืออื่นๆ)
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <label className="input input-bordered input-sm lg:input-md flex items-center gap-2 px-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 opacity-70">
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd" />
      </svg>
      <input
        ref={inputRef}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        className="lg:grow w-28 md:w-auto"
        placeholder="ค้นหา" />
      <kbd className="kbd kbd-sm hidden lg:flex">ctrl</kbd>
      <kbd className="kbd kbd-sm hidden lg:flex">K</kbd>
    </label>
  )
}

export default SearchBar