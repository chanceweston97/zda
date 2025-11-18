"use client";

// components/Sections/NetworkIntro.tsx
import Link from "next/link";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HeroIntroduction() {
  const titleRef = useScrollAnimation({ threshold: 0.2 });
  const textRef = useScrollAnimation({ threshold: 0.2 });
  const buttonsRef = useScrollAnimation({ threshold: 0.2 });
  const imageRef = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="w-full flex flex-col lg:flex-row justify-between gap-8 lg:gap-7 py-12 lg:py-12">
      {/* LEFT CONTENT */}
      <div className="max-w-2xl shrink-0">
        {/* Heading */}
        <h2 
          ref={titleRef.ref}
          className={`text-[#2958A4] text-[60px] font-medium leading-[76px] tracking-[-2.4px] transition-all duration-1000 ease-out ${
            titleRef.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          Enabling Wireless Networks Since 2008
        </h2>

        {/* Paragraph */}
        <p 
          ref={textRef.ref}
          className={`mt-6 text-[#4F6866] text-[18px] font-normal leading-7 tracking-[-0.36px] transition-all duration-1000 ease-out delay-200 ${
            textRef.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          At ZDA Communications, we care about one thing above all: reliable wireless
          performance. We design and supply industrial-grade antennas, cabling, and RF
          accessories—plus practical tools like custom cable builds—that help homes,
          enterprises, and field teams achieve clear, consistent connectivity. From fixed
          sites to mobile deployments, our hardware is engineered for uptime, verified for
          low VSWR, and built to stand up to real-world conditions so your network stays
          steady when it matters.
        </p>

        {/* Buttons */}
        <div 
          ref={buttonsRef.ref}
          className={`mt-8 flex flex-wrap gap-4 transition-all duration-1000 ease-out delay-400 ${
            buttonsRef.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/about"
            className="inline-flex items-center rounded-full 
    border border-transparent bg-[#2958A4] 
    text-white text-sm font-medium px-6 py-3 
    transition-colors 
    hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
          >
            More About Us
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center rounded-full 
    border border-transparent bg-[#2958A4] 
    text-white text-sm font-medium px-6 py-3 
    transition-colors 
    hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
          >
            Explore Products
          </Link>
        </div>

      </div>

      {/* RIGHT IMAGE */}
      <div 
        ref={imageRef.ref}
        className={`shrink-0 mx-auto lg:mx-0 transition-all duration-1000 ease-out delay-300 ${
          imageRef.isVisible 
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 translate-x-8 scale-95'
        }`}
      >
        <Image
          src="/images/hero/wireless.png"
          alt="Network intro"
          width={645}
          height={447}
          className="w-[645px] h-[447px] object-contain shrink-0"
        />
      </div>
    </section>
  );
}
