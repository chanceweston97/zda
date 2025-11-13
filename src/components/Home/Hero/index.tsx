import { getHeroBanners, getHeroSliders } from "@/sanity/sanity-shop-utils";
import HeroFeature from "./HeroFeature";
import HeroStatic from "./HeroStatic";
import HeroIntroduction from "./HeroIntroduction";
import ProudPartners from "./ProudPartners";

const Hero = async () => {
  const data = await getHeroBanners();
  const sliders = await getHeroSliders();

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-60 sm:pt-45 lg:pt-30 xl:pt-21.5">
      <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 xl:px-0 pt-6">
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="w-full">
            <div className="relative z-1 rounded-[10px]">
              <HeroStatic />
              <HeroFeature />
              <HeroIntroduction />
              <ProudPartners />
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}

      <div className="relative z-1 rounded-[10px]">
      </div>
    </section>
  );
};

export default Hero;
