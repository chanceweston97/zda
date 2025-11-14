import { CallIcon, EmailIcon, MapIcon } from "@/assets/icons";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/assets/icons/social";
import Link from "next/link";
import AccountLinks from "./AccountLinks";
import FooterBottom from "./FooterBottom";
import { AppStoreIcon, GooglePlayIcon } from "./icons";
import QuickLinks from "./QuickLinks";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="overflow-hidden">
      <div className="w-full mx-auto max-w-[1440px] sm:px-6 xl:px-0">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between xl:pt-22.5 xl:pb-15 px-[50px]">
          <div className="max-w-[330px] w-full">
            <div className="mb-7.5 text-custom-1 font-medium text-dark">
              <Link className="shrink-0" href="/">
                <Image
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={147}
                  height={61}
                />
              </Link>
            </div>

           <p>Field-tested antennas and cabling built to improve signal where it counts.</p> 

            {/* <!-- Social Links start --> */}
            <div className="flex items-center gap-4 mt-7.5">
              <Link
                href="#"
                className="flex duration-200 ease-out hover:text-blue"
              >
                <span className="sr-only">Facebook link</span>
                <FacebookIcon />
              </Link>

              <Link
                href="#"
                className="flex duration-200 ease-out hover:text-blue"
              >
                <span className="sr-only">Twitter link</span>
                <TwitterIcon />
              </Link>

              <Link
                href="#"
                className="flex duration-200 ease-out hover:text-blue"
              >
                <span className="sr-only">Instagram link</span>
                <InstagramIcon />
              </Link>

              <Link
                href="#"
                aria-label="Linkedin Social Link"
                className="flex duration-200 ease-out hover:text-blue"
              >
                <span className="sr-only">LinkedIn link</span>
                <LinkedInIcon />
              </Link>
            </div>
            {/* <!-- Social Links end --> */}
          </div>

          <AccountLinks />

          <QuickLinks />

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark lg:text-right">
              Download App
            </h2>

            <p className="mb-4 lg:text-right text-custom-sm">
              Save $3 With App & New User only
            </p>

            <ul className="flex flex-col gap-3 lg:items-end">
              <li>
                <Link
                  className="inline-flex items-center gap-3 py-[9px] pl-4 pr-7.5 text-white rounded-xl bg-dark ease-out duration-200 hover:bg-opacity-95"
                  href="#"
                >
                  <AppStoreIcon />

                  <div>
                    <span className="block text-custom-xs">
                      Download on the
                    </span>
                    <p className="font-medium">App Store</p>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  className="inline-flex items-center gap-3 py-[9px] pl-4 pr-8.5 text-white rounded-xl bg-blue ease-out duration-200 hover:bg-opacity-95"
                  href="#"
                >
                  <GooglePlayIcon />

                  <div>
                    <span className="block text-custom-xs"> Get in On </span>
                    <p className="font-medium">Google Play</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- footer menu end --> */}
      </div>

      <FooterBottom />
    </footer>
  );
};

export default Footer;
