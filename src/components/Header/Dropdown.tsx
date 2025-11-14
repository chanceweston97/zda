import Link from "next/link";
import { usePathname } from "next/navigation";

type DropdownProps = {
  menuItem: {
    title: string;
    path?: string;
    submenu: { title: string; path: string }[];
  };
  stickyMenu?: boolean;
};

const Dropdown = ({ menuItem, stickyMenu }: DropdownProps) => {
  const pathUrl = usePathname() || "";

  const isActiveParent = pathUrl.includes(
    menuItem.path || menuItem.title.toLowerCase()
  );

  return (
    <li
      className={`
        group relative
        before:absolute before:left-0 before:top-0 before:h-[3px] before:w-0
        before:rounded-b-[3px] before:bg-blue before:duration-200 before:ease-out
        hover:before:w-full
        ${isActiveParent && "before:w-full!"}
      `}
    >
      {/* TOP-LEVEL MENU LINK (CLICKABLE) */}
      <Link
        href={menuItem.path || "#"}
        className={`
          flex items-center gap-1.5 capitalize
          px-7 text-[18px] font-medium leading-7 tracking-[-0.36px]
          font-satoshi text-[#2958A4] hover:text-blue
          ${stickyMenu ? "xl:py-2" : "xl:py-3"}
          ${isActiveParent && "text-blue!"}
        `}
      >
        {menuItem.title}

        {/* CHEVRON ICON THAT ROTATES ON HOVER */}
        <svg
          className="h-5 w-5 text-dark transition-transform duration-300 group-hover:rotate-180"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* DROPDOWN – FADE + SLIDE, HOVER-ONLY, NO GAP */}
      <ul
        className={`
          absolute left-0 top-full z-50 w-52 rounded-lg bg-white p-2 shadow-lg
          origin-top transition-all duration-200 ease-out
          opacity-0 -translate-y-2 pointer-events-none
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
        `}
      >
        {menuItem.submenu.map((item, i) => {
          const isActiveChild = pathUrl === item.path;

          return (
            <li key={i}>
              <Link
                href={item.path}
                className={`
                  block rounded-md px-4 py-2 text-sm text-[#2958A4]
                  transition-colors duration-150
                  hover:bg-gray-100 hover:text-blue
                  ${isActiveChild && "bg-gray-100 text-blue"}
                `}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default Dropdown;
