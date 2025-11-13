import { getHeroBanners, getHeroSliders } from "@/sanity/sanity-shop-utils";
import Image from "next/image";
import HeroBannerItem from "./HeroBannerItem";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";

const Hero = async () => {
  const data = await getHeroBanners();
  const sliders = await getHeroSliders();

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-60 sm:pt-45 lg:pt-30 xl:pt-51.5">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 xl:px-0">
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="xl:w-2/3 w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              <HeroCarousel sliders={sliders} />
            </div>
          </div>

          <div className="xl:w-1/3 w-full flex flex-col justify-between sm:flex-row xl:flex-col gap-5">
            {data.map((bannerItem: any, key: number) => (
              <HeroBannerItem
                className={`${key === 0 ? "bg-[#D7EBF2]" : "bg-[#EAE7DE]"}`}
                key={key}
                bannerItem={bannerItem}
              />
            ))}
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
