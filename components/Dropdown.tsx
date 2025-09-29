// import Next Components
import Link from "next/link";

interface DropdownItem {
  label: string;
  href?: string;
  isDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, items }) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:px-2 xl:px-4 font-normal xl:text-base">
        {label}
        <svg
          width="12px"
          height="12px"
          className="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content gap-2 bg-base-200 rounded-box z-[1] mt-5 w-52 p-2 shadow"
      >
        {items.map((item, index) =>
          item.isDropdown ? (
            <li key={index}>
              <details>
                <summary>{item.label}</summary>
                <ul>
                  {item.dropdownItems?.map((nestedItem, nestedIndex) => (
                    <li key={nestedIndex}>
                      <Link
                        href={nestedItem.href || "#"}
                        className="hover:bg-base-300"
                      >
                        {nestedItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ) : (
            <li key={index}>
              <Link href={item.href || "#"}>{item.label}</Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Dropdown;
