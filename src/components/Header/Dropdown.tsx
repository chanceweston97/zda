import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "./icons";

const Dropdown = ({ menuItem, stickyMenu }: any) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const pathUrl = usePathname() || "";

  return (
    <li
      onClick={() => setDropdownToggler(!dropdownToggler)}
      className={`group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ${
        pathUrl.includes(menuItem.title) && "before:w-full!"
      }`}
    >
      <Link
        href="#"
        className={`hover:text-blue text-custom-sm font-medium text-dark flex items-center gap-1.5 capitalize ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        } ${pathUrl.includes(menuItem.title) && "text-blue!"}`}
      >
        {menuItem.title}

        <ChevronDown className="w-5 h-5 text-dark cursor-pointer group-hover:rotate-180" />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <ul
        className={`dropdown p-1 ${dropdownToggler && "flex"} ${
          stickyMenu
            ? "xl:group-hover:translate-y-0"
            : "xl:group-hover:translate-y-0"
        }`}
      >
        {menuItem.submenu.map((item: any, i: any) => (
          <li key={i}>
            <Link
              href={item.path}
              className={`flex text-custom-sm hover:text-blue hover:bg-gray-2 rounded-lg py-[7px] px-4.5 ${
                pathUrl === item.path && "text-blue bg-gray-1"
              } `}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Dropdown;
