"use client";
import { HeartIcon, SearchIcon } from "@/assets/icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShoppingCart } from "use-shopping-cart";
import GlobalSearchModal from "../Common/GlobalSearch";
import CustomSelect from "./CustomSelect";
import Dropdown from "./Dropdown";
import MobileDropdown from "./MobileDropdown";
import { menuData } from "./menuData";
import { useAppSelector } from "@/redux/store";
import { UserIcon } from "../MyAccount/icons";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { data: session } = useSession();

  const { handleCartClick, cartCount, totalPrice } = useShoppingCart();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const wishlistCount = wishlistItems?.length || 0;

  const handleOpenCartModal = () => {
    handleCartClick();
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-999 bg-white transition-all ease-in-out duration-300 ${stickyMenu && "shadow-sm"
          }`}
      >
        <div className="w-full px-4 mx-auto max-w-[1440px] sm:px-6 xl:px-0">
          {/* <!-- header top start --> */}
          <div
            className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${stickyMenu ? "py-4" : "py-6"
              }`}
          >
            {/* <!-- header top left --> */}
            <div className="flex w-full sm:flex-row items-end justify-between sm:items-end sm:gap-10">
              <div>
                <Link className="shrink-0" href="/">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Logo"
                    width={147}
                    height={61}
                  />
                </Link>
              </div>

              <div
                className={`w-[719px] right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between hidden`}
              >
                {/* <!-- Main Nav Start --> */}
                <nav>
                  <ul className="flex flex-col gap-5 xl:items-center xl:flex-row xl:gap-6">
                    {menuData.map((menuItem, i) =>
                      menuItem.submenu ? (
                        <Dropdown
                          key={i}
                          menuItem={menuItem}
                          stickyMenu={stickyMenu}
                        />
                      ) : (
                        <li
                          key={i}
                          className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                        >
                          <Link
                            href={menuItem.path!}
                            className={`hover:text-[#2958A4] text-[#2958A4] px-7 font-satoshi text-[18px] font-medium leading-7 tracking-[-0.36px] flex ${stickyMenu ? "xl:py-2" : "xl:py-3"
                              }`}
                          >
                            {menuItem.title}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
                {/* //   <!-- Main Nav End --> */}
              </div>
              {/* <!-- header top right --> */}
              <div className="absolute flex flex-row items-center right-20">
                <Link
                  className="w-[138px] h-[50px] flex px-2 py-2.5 justify-center items-center gap-2.5 shrink-0 rounded-[40px] bg-[#2958A4] text-white font-satoshi text-[18px] font-medium leading-7 tracking-[-0.36px]"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </div>
              {/* <!-- header top right --> */}
              <div className="flex lg:w-auto items-center gap-7.5">
                {/* <!-- divider --> */}

                <div className="flex">


                  {/* <!-- Hamburger Toggle BTN --> */}
                  <button
                    id="Toggle"
                    aria-label="Toggler"
                    className=" xl:hidden w-10 h-10 bg-transparent rounded-lg inline-flex items-center cursor-pointer justify-center hover:bg-gray-2"
                    onClick={() => setNavigationOpen(!navigationOpen)}
                  >
                    <svg
                      className="w-25 h-25"
                      width="25"
                      height="25"
                      color="#2958A4"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(0 0 0)"
                    >
                      <path
                        d="M3.5625 6C3.5625 5.58579 3.89829 5.25 4.3125 5.25H20.3125C20.7267 5.25 21.0625 5.58579 21.0625 6C21.0625 6.41421 20.7267 6.75 20.3125 6.75L4.3125 6.75C3.89829 6.75 3.5625 6.41422 3.5625 6Z"
                        fill="currentColor"
                      />
                      <path
                        d="M3.5625 18C3.5625 17.5858 3.89829 17.25 4.3125 17.25L20.3125 17.25C20.7267 17.25 21.0625 17.5858 21.0625 18C21.0625 18.4142 20.7267 18.75 20.3125 18.75L4.3125 18.75C3.89829 18.75 3.5625 18.4142 3.5625 18Z"
                        fill="currentColor"
                      />
                      <path
                        d="M4.3125 11.25C3.89829 11.25 3.5625 11.5858 3.5625 12C3.5625 12.4142 3.89829 12.75 4.3125 12.75L20.3125 12.75C20.7267 12.75 21.0625 12.4142 21.0625 12C21.0625 11.5858 20.7267 11.25 20.3125 11.25L4.3125 11.25Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  {/* //   <!-- Hamburger Toggle BTN --> */}
                </div>
              </div>
            </div>


          </div>
          {/* <!-- header top end --> */}
        </div>

        {/* Offcanvas Mobile Menu (Mobile Only) */}
        <div
          className={`fixed inset-0 z-[998] xl:hidden transition-all duration-300 ${navigationOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-dark/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setNavigationOpen(false)}
          ></div>
          {/* Sidebar */}
          <aside
            className={`fixed top-0 right-0 z-[999] h-full w-80 max-w-full bg-white shadow-2xl flex flex-col transition-all duration-300 ease-out transform ${navigationOpen ? "translate-x-0" : "translate-x-full"
              }`}
            style={{
              transitionDelay: navigationOpen ? "0ms" : "50ms",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-3">
              <Link href="/">
                <Image
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={130}
                  height={28}
                />
              </Link>
              <button
                aria-label="Close menu"
                className="w-10 h-10 bg-transparent text-dark-2 rounded-lg inline-flex items-center cursor-pointer justify-center hover:bg-gray-2"
                onClick={() => setNavigationOpen(false)}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="rotate(0 0 0)"
                >
                  <path
                    d="M6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L11.999 10.9384L16.7176 6.2198C17.0105 5.92691 17.4854 5.92691 17.7782 6.2198C18.0711 6.51269 18.0711 6.98757 17.7782 7.28046L13.0597 11.999L17.7782 16.7176C18.0711 17.0105 18.0711 17.4854 17.7782 17.7782C17.4854 18.0711 17.0105 18.0711 16.7176 17.7782L11.999 13.0597L7.28033 17.7784C6.98744 18.0713 6.51256 18.0713 6.21967 17.7784C5.92678 17.4855 5.92678 17.0106 6.21967 16.7177L10.9384 11.999L6.21967 7.28033Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="flex flex-col gap-1">
                {menuData.map((menuItem, i) =>
                  menuItem.submenu ? (
                    <MobileDropdown
                      key={i}
                      menuItem={menuItem}
                      onClose={() => setNavigationOpen(false)}
                    />
                  ) : (
                    <li
                      key={i}
                      className={`transform transition-all duration-300 ease-out ${navigationOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                        }`}
                      style={{
                        transitionDelay: navigationOpen ? `${i * 50}ms` : "0ms",
                      }}
                    >
                      <Link
                        href={menuItem.path!}
                        className="flex items-center gap-2 text-sm font-medium text-dark py-2 px-3 rounded-md hover:bg-blue/10 hover:text-blue transition-colors"
                        onClick={() => setNavigationOpen(false)}
                      >
                        {menuItem.title}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>{" "}

          </aside>
        </div>
      </header>

      {searchModalOpen && (
        <GlobalSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
        />
      )}
    </>
  );
};

export default Header;
