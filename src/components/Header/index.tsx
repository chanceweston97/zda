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
        className={`fixed left-0 top-0 w-full z-999 bg-white transition-all ease-in-out duration-300 ${
          stickyMenu && "shadow-sm"
        }`}
      >
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
          {/* <!-- header top start --> */}
          <div
            className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
              stickyMenu ? "py-4" : "py-6"
            }`}
          >
            {/* <!-- header top left --> */}
            <div className="flex flex-col w-full gap-5 xl:w-auto sm:flex-row xl:justify-between sm:items-center sm:gap-10">
              <Link className="shrink-0" href="/">
                <Image
                  src="/images/logo/logo.svg"
                  alt="Logo"
                  width={165}
                  height={36}
                />
              </Link>

              <div className="max-w-[475px] w-full">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="flex gap-2 items-center">
                    <CustomSelect />

                    <div className="relative lg:min-w-[370px] w-full">
                      <input
                        onClick={() => {
                          setSearchModalOpen(true);
                        }}
                        defaultValue={""}
                        type="search"
                        name="search"
                        id="search"
                        placeholder="I am shopping for..."
                        autoComplete="off"
                        className="custom-search  w-full rounded-full bg-gray-1  border border-gray-3 h-[42px] py-2.5 pl-5 pr-10 outline-hidden ease-in duration-200"
                      />
                      <button
                        type="submit"
                        id="search-btn"
                        aria-label="Search"
                        className="absolute flex items-center h-[42px] justify-center duration-200 ease-in  -translate-y-1/2 right-5 top-1/2 hover:text-blue"
                      >
                        <SearchIcon className="w-5 h-5 text-gray-6" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* <!-- header top right --> */}
            <div className="flex w-full lg:w-auto items-center gap-7.5">
              {/* <!-- divider --> */}

              <div className="flex items-center justify-between w-full gap-8 lg:w-auto">
                <div className="items-center gap-5 flex">
                  <Link
                    href={`${session?.user ? "/my-account" : "/signin"}`}
                    className=" items-center gap-2.5 hidden xl:flex"
                  >
                    <div className="flex items-center justify-center w-9 h-9 border border-gray-3 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M10.5186 10.0869C13.8936 10.087 16.6296 12.8232 16.6299 16.1982V16.5107C16.6297 16.9248 16.2939 17.2607 15.8799 17.2607C15.466 17.2605 15.13 16.9247 15.1299 16.5107V16.1982C15.1296 13.6516 13.0652 11.587 10.5186 11.5869H7.48047C4.93384 11.587 2.86939 13.6516 2.86914 16.1982V16.5107C2.86899 16.9248 2.5332 17.2607 2.11914 17.2607C1.70502 17.2607 1.36929 16.9248 1.36914 16.5107V16.1982C1.36939 12.8232 4.10541 10.087 7.48047 10.0869H10.5186ZM8.99902 0.740234C11.2345 0.740301 13.0469 2.55263 13.0469 4.78809C13.0465 7.02326 11.2343 8.83587 8.99902 8.83594C6.76376 8.83589 4.9515 7.02328 4.95117 4.78809C4.95117 2.55261 6.76356 0.740277 8.99902 0.740234ZM8.99902 2.24023C7.59199 2.24028 6.45117 3.38104 6.45117 4.78809C6.4515 6.19485 7.59219 7.33589 8.99902 7.33594C10.4058 7.33587 11.5465 6.19484 11.5469 4.78809C11.5469 3.38105 10.406 2.2403 8.99902 2.24023Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="group">
                      <span className="block uppercase font-medium text-2xs text-dark-4">
                        account
                      </span>
                      <p className="font-medium text-custom-sm text-dark hover:text-blue">
                        {session?.user.name?.split(" ")[0] ||
                          "Sign In / Register"}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2.5">
                    {/* Wishlist */}
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2.5 justify-center w-8 h-8"
                    >
                      <span className="relative inline-block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="18"
                          viewBox="0 0 21 18"
                          fill="none"
                        >
                          <path
                            d="M2.72345 2.8023C0.769267 4.75648 0.769268 7.92483 2.72345 9.87901L9.44713 16.6028C10.0329 17.1886 10.9827 17.1886 11.5685 16.6028L18.2922 9.87912C20.2463 7.92494 20.2463 4.75659 18.2922 2.80241C16.338 0.848229 13.1696 0.84823 11.2155 2.80241L10.5079 3.51001L9.80015 2.8023C7.84597 0.848125 4.67762 0.848125 2.72345 2.8023Z"
                            stroke="#1C274C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {isMounted && (
                          <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2.5 bg-red w-4.5 h-4.5 rounded-full text-white">
                            {wishlistCount}
                          </span>
                        )}
                      </span>
                    </Link>

                    {/* Cart */}
                    <button
                      onClick={handleOpenCartModal}
                      className="flex items-center gap-2.5 w-8 h-8 justify-center"
                    >
                      <span className="relative inline-block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M12 4V5C12 6.65685 10.6569 8 9 8C7.34315 8 6 6.65685 6 5V4M2.5 17H15.5C16.3284 17 17 16.3284 17 15.5V2.5C17 1.67157 16.3284 1 15.5 1H2.5C1.67157 1 1 1.67157 1 2.5V15.5C1 16.3284 1.67157 17 2.5 17Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2.5 bg-red w-4.5 h-4.5 rounded-full text-white">
                          {cartCount}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* <!-- Hamburger Toggle BTN --> */}
                <button
                  id="Toggle"
                  aria-label="Toggler"
                  className=" xl:hidden w-10 h-10 bg-transparent rounded-lg inline-flex items-center cursor-pointer justify-center hover:bg-gray-2"
                  onClick={() => setNavigationOpen(!navigationOpen)}
                >
                  <svg
                    className="w-7 h-7"
                    width="32"
                    height="32"
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
          {/* <!-- header top end --> */}
        </div>

        <div className="xl:border-y border-b border-gray-3">
          <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
            <div className="flex items-center justify-between">
              {/* <!--=== Main Nav Start ===--> */}
              {/* Desktop Nav Only */}
              <div
                className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between hidden`}
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
                            className={`hover:text-blue text-custom-sm font-medium text-dark flex ${
                              stickyMenu ? "xl:py-4" : "xl:py-6"
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
              {/* // <!--=== Main Nav End ===--> */}
              <div className="hidden xl:block">
                <Link
                  href="/popular?sort=popular"
                  className="text-sm text-dark flex items-center font-medium hover:text-blue"
                >
                  Best Selling
                  <span className="bg-red text-white font-semibold text-[10px] inline-flex items-center justify-center rounded-full ml-2.5  px-2 h-5 uppercase">
                    SALE
                  </span>
                </Link>
              </div>
            </div>
          </div>
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
            className={`fixed top-0 right-0 z-[999] h-full w-80 max-w-full bg-white shadow-2xl flex flex-col transition-all duration-300 ease-out transform ${
              navigationOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              transitionDelay: navigationOpen ? "0ms" : "50ms",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-3">
              <Link href="/">
                <Image
                  src="/images/logo/logo.svg"
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
                      className={`transform transition-all duration-300 ease-out ${
                        navigationOpen
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
            <div className="px-3 py-4 border-t space-y-1 border-gray-3 flex flex-col gap-2">
              <Link
                href={session?.user ? "/my-account" : "/signin"}
                className={`flex items-center gap-2 text-dark px-2 py-1 hover:bg-blue/10 rounded-md hover:text-blue font-medium text-sm transition-all duration-300 ease-out transform ${
                  navigationOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: navigationOpen
                    ? `${menuData.length * 50}ms`
                    : "0ms",
                }}
                onClick={() => setNavigationOpen(false)}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                  <UserIcon className="w-5 h-5" />
                </span>
                {session?.user?.name?.split(" ")[0] || "Sign In / Register"}
              </Link>
              <Link
                href="/wishlist"
                className={`flex items-center gap-2 text-dark hover:text-blue px-2 py-1 hover:bg-blue/10 rounded-md font-medium text-sm transition-all duration-300 ease-out transform ${
                  navigationOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: navigationOpen
                    ? `${(menuData.length + 1) * 50}ms`
                    : "0ms",
                }}
                onClick={() => setNavigationOpen(false)}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full relative">
                  <HeartIcon className="w-5 h-5" />
                </span>
                Wishlist
              </Link>
            </div>
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
