import Link from "next/link";
import FooterBottom from "./FooterBottom";
import QuickLinks from "./QuickLinks";
import Image from "next/image";
import ProductsLinks from "./ProductsLinks";
import Legal from "./Legal";
import Info from "./Info";

const Footer = () => {
  return (
    <footer className="overflow-hidden">
      <div className="w-full mx-auto bg-[#2958A4] text-white/60 max-w-[1340px] sm:px-6 xl:px-0 lg:h-[392px] shrink-0 self-stretch">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between xl:pt-22.5 xl:pb-15 px-[50px]">
          <div className="max-w-[330px] w-full mt-5 lg:mt-0">
            <div className="mb-7.5 text-custom-1 font-medium text-dark">
              <Link className="shrink-0" href="/">
                <Image
                  src="/images/logo/logo-white.png"
                  alt="Logo"
                  width={147}
                  height={61}
                />
              </Link>
            </div>

           <p className="text-white/60 font-satoshi font-medium leading-[26px] mb-2">Field-tested antennas and cabling built to improve signal where it counts.</p> 

            {/* Address content */}
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  className="ease-out duration-200 hover:text-white text-white/60"
                  href="#"
                >
                  3040 McNaughton Dr. Ste. A Columbia, SC 29223
                </Link>
              </li>
              <li>
                <Link
                  className="ease-out duration-200 hover:text-white text-white/60"
                  href="email:sales@zdacomm.com"
                >
                  sales@zdacomm.com
                </Link>
              </li>
              <li>
                <Link
                  className="ease-out duration-200 hover:text-white text-white/60"
                  href="tel:18034194702"
                >
                  +1 (803) 419-4702
                </Link>
              </li>
            </ul>

            {/* <!-- Social Links start --> */}
            {/* <div className="flex items-center gap-4 mt-7.5">
              <Link
                href="#"
                className="flex duration-200 ease-out hover:text-white"
              >
                <span className="sr-only">Facebook link</span>
                <FacebookIcon />
              </Link>

              <Link
                href="#"
                className="flex duration-200 ease-out hover:text-white"
              >
                <span className="sr-only">Twitter link</span>
                <TwitterIcon />
              </Link>

              <Link
                href="#"
                className="flex duration-200 ease-out hover:text-white"
              >
                <span className="sr-only">Instagram link</span>
                <InstagramIcon />
              </Link>

              <Link
                href="#"
                aria-label="Linkedin Social Link"
                className="flex duration-200 ease-out hover:text-white"
              >
                <span className="sr-only">LinkedIn link</span>
                <LinkedInIcon />
              </Link>
            </div> */}
            {/* <!-- Social Links end --> */}
          </div>

          <ProductsLinks />

          <QuickLinks />
          <Legal />
          <Info />

          
        </div>
        {/* <!-- footer menu end --> */}
      </div>

      <FooterBottom />
    </footer>
  );
};

export default Footer;
