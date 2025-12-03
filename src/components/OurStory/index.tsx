import ProudPartners from "../Home/Hero/ProudPartners";
import WorkWithUsSection from "../AboutUs/WorkWithUs";
import FaqSection from "../Home/Faq";
import Newsletter from "../Common/Newsletter";
import { getProudPartners, getFaq, getOurStory, imageBuilder } from "@/sanity/sanity-shop-utils";
import { AnimatedHeroSection, AnimatedWhatWeFocusOn, AnimatedLetsWorkTogether } from "./AnimatedSections";

export default async function OurStory() {
  let partnersData = null;
  let faqData = null;
  let ourStoryData = null;

  try {
    const results = await Promise.allSettled([
      getProudPartners(),
      getFaq(),
      getOurStory(),
    ]);

    partnersData = results[0].status === 'fulfilled' ? results[0].value : null;
    faqData = results[1].status === 'fulfilled' ? results[1].value : null;
    ourStoryData = results[2].status === 'fulfilled' ? results[2].value : null;
  } catch (error) {
    console.error('Error fetching Our Story data:', error);
  }

  // Build image URLs on the server side
  let focusImageUrl = "/images/hero/wireless.png";
  if (ourStoryData?.whatWeFocusOn?.image) {
    try {
      const builder = imageBuilder(ourStoryData.whatWeFocusOn.image);
      const url = builder.url();
      if (url) focusImageUrl = url;
    } catch (error) {
      console.error('Error building focus image URL:', error);
    }
  }

  let workImageUrl = "/images/hero/wireless.png";
  if (ourStoryData?.letsWorkTogether?.image) {
    try {
      const builder = imageBuilder(ourStoryData.letsWorkTogether.image);
      const url = builder.url();
      if (url) workImageUrl = url;
    } catch (error) {
      console.error('Error building work image URL:', error);
    }
  }

  return (
    <main className="overflow-hidden">
      {/* Our Story Section */}
      <AnimatedHeroSection heroData={ourStoryData?.heroSection} />

      {/* What We Focus On Section */}
      <AnimatedWhatWeFocusOn focusData={ourStoryData?.whatWeFocusOn} imageUrl={focusImageUrl} />

      {/* Let's Work Together Section */}
      <AnimatedLetsWorkTogether workData={ourStoryData?.letsWorkTogether} imageUrl={workImageUrl} />

      {/* Proud Partners Section */}
      <ProudPartners partnersData={partnersData} />

      {/* Work With Us Section */}
        <WorkWithUsSection />

      {/* FAQ Section */}
        <FaqSection faqData={faqData} />

      {/* Newsletter Section */}
          <Newsletter />
    </main>
  );
}

