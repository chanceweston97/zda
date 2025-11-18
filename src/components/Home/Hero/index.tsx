import { getHeroBanners, getHeroIntroduction, getProudPartners, getWhatWeOffer } from "@/sanity/sanity-shop-utils";
import HeroStatic from "./HeroStatic";
import HeroIntroduction from "./HeroIntroduction";
import ProudPartners from "./ProudPartners";
import WhatWeOffer from "./WhatWeOffer";

const Hero = async () => {
  const bannerData = await getHeroBanners();
  const introductionData = await getHeroIntroduction();
  const partnersData = await getProudPartners();
  const whatWeOfferData = await getWhatWeOffer();

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-20 sm:pt-25 lg:pt-30 xl:pt-21.5">
      <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 xl:px-0 pt-6">
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="w-full">
            <div className="relative z-1 rounded-[10px]">
              <HeroStatic bannerData={bannerData} />
              {/* <HeroFeature /> */}
              <HeroIntroduction introductionData={introductionData} />
              <ProudPartners partnersData={partnersData} />
              <WhatWeOffer whatWeOfferData={whatWeOfferData} />
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
