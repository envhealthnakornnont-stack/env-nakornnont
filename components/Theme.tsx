"use client";
import { SwatchBook, ChevronDown, Check } from "lucide-react";
import { useEffect, useState } from "react";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

const Theme = () => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const themeFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("theme="))
        ?.split("=")[1];
      setCurrentTheme(themeFromCookie || "light"); // fallback
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=86400`; // อายุ 1 วัน
    setCurrentTheme(theme);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost font-normal px-2 xl:mx-2">
        <SwatchBook size={20} />
        <ChevronDown size={14} />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded-box z-[1] top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-16"
      >
        <div className="grid grid-cols-1 gap-3 p-3">
          {themes.map((theme) => (
            <button
              key={theme}
              className={`outline-base-content text-start outline-offset-4 ${currentTheme === theme ? '[&_svg]:visible' : ''}`}
              data-set-theme={theme}
              onClick={() => handleThemeChange(theme)}
            >
              <span className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans" data-theme={theme}>
                <span className="grid grid-cols-5 grid-rows-3">
                  <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">

                    <span>
                      <Check className={`shrink-0 ${currentTheme === theme ? '' : 'invisible'}`} size={16} />
                    </span>
                    <span className="flex-grow text-sm">{theme}</span>
                    <span className="flex h-full shrink-0 flex-wrap gap-1">
                      <span className="bg-primary rounded-badge w-2 h-2"></span>
                      <span className="bg-secondary rounded-badge w-2 h-2"></span>
                      <span className="bg-accent rounded-badge w-2 h-2"></span>
                      <span className="bg-neutral rounded-badge w-2 h-2"></span>
                    </span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theme;
