"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

type Brand = { name: string; logo: string };

const defaultBrands: Brand[] = [
  { name: "Motus", logo: "/images/hero/motus.png" },
  { name: "Motus", logo: "/images/hero/motus.png" },
  { name: "Motus", logo: "/images/hero/motus.png" },
  { name: "Motus", logo: "/images/hero/motus.png" },
  { name: "Motus", logo: "/images/hero/motus.png" },
];

export default function ProudPartners({ brands = defaultBrands }: { brands?: Brand[] }) {
  return (
    <section className="w-full py-12 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h2 className="text-center text-[#3a57b7] font-semibold tracking-tight
                       text-3xl sm:text-4xl lg:text-5xl">
          Proud Partners Of
        </h2>

        {/* Carousel */}
        <div className="mt-8">
          <Swiper
            modules={[Autoplay, FreeMode]}
            loop
            freeMode
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={4500}                 // smooth continuous scroll
            slidesPerView={2}
            spaceBetween={24}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 28 },
              768: { slidesPerView: 4, spaceBetween: 32 },
              1024:{ slidesPerView: 5, spaceBetween: 36 },
            }}
            className="!overflow-hidden"
            aria-label="Brand partners carousel"
          >
            {/* duplicate once to ensure seamless loop */}
            {[...brands, ...brands].map((b, i) => (
              <SwiperSlide key={`${b.name}-${i}`}>
                <div className="flex items-center justify-center">
                  <Image
                    src={b.logo}
                    alt={b.name}
                    width={180}
                    height={56}
                    className="h-14 w-auto object-contain"
                    priority={i < 5}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
