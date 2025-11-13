import Image from "next/image";
import Link from "next/link";

export default function HeroStatic() {
  return (
    <section className="relative w-full max-h-[560px] h-[560px] rounded-2xl overflow-hidden">

      <Image
        src="/images/hero/banner.webp"
        alt="Hero"
        fill
        priority
        className="object-cover"
      />

      {/* ✅ Soft gradient for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/25 to-transparent" />

      {/* ✅ Left text + buttons */}
      <div className="absolute z-10 left-6 sm:left-10 lg:left-16 top-1/3 md:top-1/2 -translate-y-1/2 max-w-[760px]">
        <h1 className="text-white font-semibold leading-tight text-[20px] sm:text-[30px] lg:text-[32px] tracking-tight font-satoshi mb-10">
          Field-tested antennas and cabling <br />
          built to improve signal where it counts. 
        </h1>

        <div className="mt-5 flex flex-wrap gap-3 mb-10">
          <Link
            href="/shop-with-sidebar"
            className="inline-flex items-center rounded-full bg-[#4E6FFF] hover:bg-[#3d58d1] text-white text-sm font-medium px-6 py-2.5"
          >
            All Products
          </Link>

          <Link
            href="/cable-customizer"
            className="inline-flex items-center rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-6 py-2.5 backdrop-blur"
          >
            Cable Customizer
          </Link>
        </div>
        <p className="text-white/90 text-5xl sm:text-7xl mt-26 font-bold font-satoshi bottom-0">
          ZDA Communications
        </p>
      </div>

      {/* ✅ Small right card */}
      <aside className="absolute z-10 right-4 sm:right-6 bottom-4 sm:bottom-6 w-[260px] rounded-xl bg-white/70 backdrop-blur-md shadow-md overflow-hidden">
        <div className="relative w-full h-[240px]">
          <Image
            src="/images/products/antenna.png"
            alt="Premium Antennas"
            fill
            className="object-fit opacity-70"
          />
        </div>

        <div className="p-3">
          <h3 className="text-sm font-semibold">
            Premium Antennas
          </h3>
          <p className="mt-1 text-xs text-gray-700">&quot;Superior Performance&quot;</p>
        </div>
      </aside>
    </section>
  );
}
