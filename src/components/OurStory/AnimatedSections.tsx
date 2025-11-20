"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function AnimatedHeroSection() {
  const heroTitleRef = useScrollAnimation({ threshold: 0.2 });
  const heroTextRef = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[150px]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 xl:px-0">
        <div className="text-center">
          <h1 
            ref={heroTitleRef.ref}
            className={`text-[#2958A4] text-[48px] sm:text-[56px] lg:text-[66px] font-medium leading-[58px] sm:leading-[66px] lg:leading-[76px] tracking-[-1.92px] sm:tracking-[-2.24px] lg:tracking-[-2.64px] transition-all duration-1000 ease-out ${
              heroTitleRef.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            Our Story
          </h1>
          <p 
            ref={heroTextRef.ref}
            className={`mt-6 mx-auto text-[#2958A4] text-center font-satoshi text-[24px] font-medium leading-[26px] transition-all duration-1000 ease-out delay-300 ${
              heroTextRef.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            Since 2008, we've focused on designing and supplying RF hardware—antennas, cables, connectors, attenuators, and custom builds—that helps homes, organizations, and field teams stay in touch when it matters most.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AnimatedWhatWeFocusOn() {
  const focusOnTitleRef = useScrollAnimation({ threshold: 0.2 });
  const focusOnContentRef = useScrollAnimation({ threshold: 0.2 });
  const focusOnImageRef = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="w-full py-12 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 xl:px-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Text Content */}
          <div ref={focusOnContentRef.ref} className={`transition-all duration-1000 ease-out ${
            focusOnContentRef.isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <h2 
              ref={focusOnTitleRef.ref}
              className={`text-[#2958A4] text-[40px] sm:text-[48px] lg:text-[56px] font-medium leading-tight tracking-[-0.04em] transition-all duration-1000 ease-out ${
                focusOnTitleRef.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              What We Focus On
            </h2>
            <p className="mt-6 text-black text-[18px] leading-7">
              We don't try to be everything to everyone. We focus on the RF path:
            </p>
            
            <ul className="mt-3 text-black text-[18px]">
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span><strong className="text-black">Antennas</strong> - Directional and omni RF antennas for reliable, real-world coverage.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span><strong className="text-black">Cables</strong> - Low-loss coaxial cable assemblies built to your spec, assembled in the United States.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span><strong className="text-black">Connectors, Adapters, RF Accessories</strong> - Industrial-grade RF connectors, adapters and supporting components for secure, low-VSWR joins, and easy installation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span><strong className="text-black">Attenuators & RF Accessories</strong> - Supporting components that help protect equipment, fine-tune systems, and make installations easier.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span><strong className="text-black">Custom Cable Builds</strong> - Practical, build-to-order cable solutions so you can get the exact lengths and terminations you need for your real-world deployment.</span>
              </li>
            </ul>

            <p className="mt-8 text-black text-[18px] leading-7">
              Every product we offer is ultimately in service of the same idea: make it easier to build links that stay up.
            </p>
          </div>

          {/* Right: Image */}
          <div 
            ref={focusOnImageRef.ref}
            className={`lg:sticky lg:top-8 transition-all duration-1000 ease-out delay-300 ${
              focusOnImageRef.isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/hero/wireless.png"
                alt="RF hardware and connectivity"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnimatedLetsWorkTogether() {
  const workTogetherTitleRef = useScrollAnimation({ threshold: 0.2 });
  const workTogetherContentRef = useScrollAnimation({ threshold: 0.2 });
  const workTogetherImageRef = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 xl:px-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Image */}
          <div 
            ref={workTogetherImageRef.ref}
            className={`lg:sticky lg:top-8 transition-all duration-1000 ease-out ${
              workTogetherImageRef.isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/hero/wireless.png"
                alt="RF connectivity and partnerships"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div 
            ref={workTogetherContentRef.ref}
            className={`transition-all duration-1000 ease-out delay-300 ${
              workTogetherContentRef.isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <h2 
              ref={workTogetherTitleRef.ref}
              className={`text-[#2958A4] text-[40px] sm:text-[48px] lg:text-[56px] font-medium leading-tight tracking-[-0.04em] transition-all duration-1000 ease-out ${
                workTogetherTitleRef.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              Let's Work Together
            </h2>
            <p className="mt-6 text-black text-[18px] leading-7">
              Over the years, ZDA Communications has supported a wide range of people and teams who all share the same need: reliable connectivity.
            </p>
            
            <h3 className="mt-8 text-[#2958A4] text-[24px] sm:text-[28px] font-medium">
              That includes:
            </h3>
            
            <ul className="mt-3 text-black text-[18px]">
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span>Municipal and government organizations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span>Utilities, SCADA, and industrial control networks</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span>Wireless ISPs and fixed wireless operators</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span>Integrators and installation teams</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span>Enterprises, campuses, and facilities</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-black">•</span>
                <span>Radio enthusiasts, hobbyists, and small project builders</span>
              </li>
            </ul>

            <p className="mt-8 text-black text-[18px] leading-7">
              Whether you're maintaining a mission-critical network or setting up a single link at a remote site, we want to make the RF side of your job simpler and more dependable.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full border border-transparent bg-[#2958A4] text-white text-sm font-medium px-6 py-3 transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
              >
                Explore Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-transparent bg-[#2958A4] text-white text-sm font-medium px-6 py-3 transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

