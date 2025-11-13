"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { imageBuilder } from "@/sanity/sanity-shop-utils";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";

const HeroCarousal = ({ sliders }: any) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {sliders?.map((slider: any, key: number) => (
        <SwiperSlide key={key}>
          <div>
            <div className="max-w-[366px] absolute left-8 lg:left-20 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-4 mb-5">
                <span className="block font-medium text-lg uppercase text-white">
                  {slider?.discount}
                </span>
              </div>

              <h1 className="font-semibold text-white text-xl sm:text-[40px] mb-3">
                <Link href={`/products/${slider?.product?.slug.current}`}>
                  {slider?.product?.name}
                </Link>
              </h1>

              <p className="text-sm text-white/80">
                {slider?.product?.shortDescription.slice(0, 100)}
              </p>

              <Link
                href={`/products/${slider?.product?.slug.current}`}
                className="inline-flex font-medium text-white text-custom-sm rounded-full bg-blue py-3 px-9 ease-out duration-200 hover:bg-blue-dark mt-6 sm:mt-10"
              >
                Shop Now
              </Link>
            </div>
            <Image
              src={
                slider?.image ? imageBuilder(slider?.image).url()! : "/no image"
              }
              width={981}
              height={533}
              loading="eager"
              className="rounded-[10px] w-full max-h-[533px]"
              alt="headphone"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
