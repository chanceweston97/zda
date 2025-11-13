import Image from "next/image";
import Link from "next/link";

export default function HeroStatic() {
  return (
    <section className="relative w-full h-[640px] md:h-[800px] rounded-2xl overflow-hidden">
      {/* Background */}
      <Image
        src="/images/hero/banner.webp"
        alt="Hero"
        fill
        priority
        className="object-cover brightness-50"
      />

      {/* Dark overlay similar to screenshot */}
      <div className="absolute inset-0 bg-black/40 bg-linear-to-t from-black/50 via-black/20 to-transparent" />

      {/* LEFT TEXT + BUTTONS */}
      <div className="absolute left-6 sm:left-8 lg:left-10 z-10 max-w-[1136px]">
        <h1 className="text-white text-[24px] lg:text-[72px] font-medium md:leading-24 md:tracking-[-2.88px] mt-[50px]">
          Field-tested antennas and cabling <br />
          built to improve signal where it counts.
        </h1>

        <div className="flex flex-col mt-5 gap-3 mb-3">
          <Link
            href="/shop-with-sidebar"
            className="w-[186px] justify-center flex items-center rounded-full bg-[#2958A4] hover:bg-[#2958A4] text-white text-sm font-medium px-6 py-2.5"
          >
            All Products
          </Link>

          <Link
            href="/cable-customizer"
            className="w-[186px] flex justify-center items-center rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-6 py-2.5 backdrop-blur"
          >
            Cable Customizer
          </Link>
        </div>
      </div>

      {/* BOTTOM-LEFT BRAND NAME */}
      <div className="absolute bottom-0 left-6 sm:left-8 lg:left-10 z-10">
        <p className="text-white text-[28px] sm:text-[60px] lg:text-[100px] font-light tracking-tight">
          ZDA Communications
        </p>
      </div>

      {/* BOTTOM-RIGHT CARD (hidden on mobile for cleaner layout) */}
      <div className="md:block absolute bottom-8 right-6 sm:right-10 lg:right-16 z-10">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 w-60 lg:w-[292px] xs:mb-12">
          <div className="relative w-full h-[250px] rounded-lg overflow-hidden mb-3">
            <Image
              src="/images/products/antenna.png"
              alt="Premium Antennas"
              fill
              className="w-[250px] h-[250px]"
            />
          </div>

          <h3 className="text-white text-2xl">
            Precision & Performance
          </h3>

          <p className="text-white/80 text-[18px] mt-1 leading-relaxed">
            Empowering connectivity with engineered reliability and real world results
          </p>
        </div>
      </div>
    </section>
  );
}
