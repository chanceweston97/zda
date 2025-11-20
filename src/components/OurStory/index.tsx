import ProudPartners from "../Home/Hero/ProudPartners";
import WorkWithUsSection from "../AboutUs/WorkWithUs";
import FaqSection from "../Home/Faq";
import Newsletter from "../Common/Newsletter";
import { getProudPartners, getFaq } from "@/sanity/sanity-shop-utils";
import { AnimatedHeroSection, AnimatedWhatWeFocusOn, AnimatedLetsWorkTogether } from "./AnimatedSections";

export default async function OurStory() {
  const partnersData = await getProudPartners();
  const faqData = await getFaq();

  return (
    <main className="overflow-hidden">
      {/* Our Story Section */}
      <AnimatedHeroSection />

      {/* What We Focus On Section */}
      <AnimatedWhatWeFocusOn />

      {/* Let's Work Together Section */}
      <AnimatedLetsWorkTogether />

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

