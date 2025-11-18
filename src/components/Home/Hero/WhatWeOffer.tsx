"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function WhatWeOffer() {
    const headerRef = useScrollAnimation({ threshold: 0.2 });
    const firstRowRef = useScrollAnimation({ threshold: 0.2 });
    const secondRowRef = useScrollAnimation({ threshold: 0.2 });
    const thirdRowRef = useScrollAnimation({ threshold: 0.2 });

    return (
        <section className="bg-[#F4F4F4] lg:p-[50px] flex items-center gap-2.5 rounded-[20px]">
            <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6">

                {/* HEADER */}
                <div 
                    ref={headerRef.ref}
                    className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between items-end transition-all duration-1000 ease-out ${
                        headerRef.isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    <h2 className="text-[#2958A4] text-[60px] font-medium leading-[76px] tracking-[-1.2px]">
                        What We Offer
                    </h2>

                    <Link
                        href="/products"
                        className="inline-flex items-center rounded-full 
    border border-transparent bg-[#2958A4] 
    text-white text-sm font-medium px-6 py-3 
    transition-colors 
    hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
                    >
                        Explore Products
                    </Link>
                </div>



                {/* First ROW — STATIC */}
                <div 
                    ref={firstRowRef.ref}
                    className={`flex flex-col gap-6 lg:flex-row justify-between py-5 transition-all duration-1000 ease-out delay-200 ${
                        firstRowRef.isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8'
                    }`}
                >

                    {/* LEFT CARD — FIXED WIDTH 790px */}
                    <div className="w-full lg:max-w-[890px]">
                        <div className="rounded-[20px] bg-white px-8 py-8 shadow-sm lg:min-h-[412px] flex flex-col justify-between">

                            <h3 className="text-[#2958A4] text-5xl font-medium mb-6">
                                Antennas
                            </h3>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-10">

                                {/* TAGS */}
                                <div className="flex flex-wrap gap-3 w-full sm:w-auto ">
                                    {["Yagi", "Omnidirectional", "Grid Parabolic", "Rubber Ducky"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="flex justify-center items-center px-5 py-2.5 rounded-full border border-white bg-[#F4F4F4] text-[#2958A4] text-[16px] font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-col max-w-[400px]">
                                    <p className="text-[#383838] text-[18px] font-normal leading-7 mb-8">
                                        Directional and omnidirectional options engineered for reliable
                                        coverage—from VHF/UHF to LTE/5G sub-6 GHz. Field-ready builds with
                                        verified VSWR for clean links in real-world conditions.
                                    </p>

                                    <Link
                                        href="/products/antennas"
                                        className="self-start inline-flex items-center justify-center gap-2.5 px-6 py-2 rounded-full bg-[#2958A4] text-white text-[16px] font-medium hover:bg-[#1f4480] transition"
                                    >
                                        Explore Antennas
                                    </Link>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGE — FIXED WIDTH 423px, MATCH HEIGHT OF CARD */}
                    <div className="w-full lg:max-w-[423px]">
                        <div className="relative h-full min-h-[380px] lg:min-h-[412px] rounded-[20px] overflow-hidden bg-gray-200">
                            <Image
                                src="/images/hero/wireless.png"
                                alt="Antennas"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                </div>
                {/* Second ROW — STATIC */}
                <div 
                    ref={secondRowRef.ref}
                    className={`flex flex-col gap-6 lg:flex-row justify-between transition-all duration-1000 ease-out delay-300 ${
                        secondRowRef.isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    {/* LEft IMAGE — FIXED WIDTH 423px, MATCH HEIGHT OF CARD */}
                    <div className="w-full lg:max-w-[423px] order-2 lg:order-1">
                        <div className="relative h-full min-h-[380px] lg:min-h-[412px] rounded-[20px] overflow-hidden bg-gray-200">
                            <Image
                                src="/images/hero/wireless.png"
                                alt="Antennas"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                    {/* Right CARD — FIXED WIDTH 790px */}
                    <div className="w-full lg:max-w-[890px] order-1 lg:order-2">
                        <div className="rounded-[20px] bg-white px-8 py-8 shadow-sm lg:min-h-[412px] flex flex-col justify-between">

                            <h3 className="text-[#2958A4] text-5xl font-medium mb-6">
                                Coaxial Cables
                            </h3>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-10">

                                {/* TAGS */}
                                <div className="flex flex-wrap gap-3 w-full sm:w-auto ">
                                    {["LMR/RG Cables", "Any Length", "Standard Connectors", "Bulk Spools"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="flex justify-center items-center px-5 py-2.5 rounded-full border border-white bg-[#F4F4F4] text-[#2958A4] text-[16px] font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-col max-w-[400px]">
                                    <p className="text-[#383838] text-[18px] font-normal leading-7 mb-8">
                                        Low-loss 50-ohm assemblies cut to length with precise terminations for minimal attenuation and maximum durability. Any length, assembled in the United States.
                                    </p>

                                    <Link
                                        href="/products/antennas"
                                        className="self-start inline-flex items-center justify-center gap-2.5 px-6 py-2 rounded-full bg-[#2958A4] text-white text-[16px] font-medium hover:bg-[#1f4480] transition"
                                    >
                                        Explore Cables
                                    </Link>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Third ROW — STATIC */}
                <div 
                    ref={thirdRowRef.ref}
                    className={`flex flex-col gap-6 lg:flex-row justify-between pt-5 transition-all duration-1000 ease-out delay-400 ${
                        thirdRowRef.isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8'
                    }`}
                >

                    {/* LEFT CARD — FIXED WIDTH 790px */}
                    <div className="w-full lg:max-w-[890px]">
                        <div className="rounded-[20px] bg-white px-8 py-8 shadow-sm lg:min-h-[412px] flex flex-col justify-between">

                            <h3 className="text-[#2958A4] text-5xl font-medium mb-6">
                                Connectors & Accessories
                            </h3>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-10">

                                {/* TAGS */}
                                <div className="flex flex-wrap gap-3 w-full sm:w-auto ">
                                    {["Connectors", "Surge Arrestors", "Splitters", "Attenuators"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="flex justify-center items-center px-5 py-2.5 rounded-full border border-white bg-[#F4F4F4] text-[#2958A4] text-[16px] font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-col max-w-[400px]">
                                    <p className="text-[#383838] text-[18px] font-normal leading-7 mb-8">
                                        Industry-standard RF connectors, adapters, and couplers for secure, low-resistance joins<br /> across your network.
                                        Available in N, SMA, TNC, and more.
                                    </p>

                                    <Link
                                        href="/products/antennas"
                                        className="self-start inline-flex items-center justify-center gap-2.5 px-6 py-2 rounded-full bg-[#2958A4] text-white text-[16px] font-medium hover:bg-[#1f4480] transition"
                                    >
                                        Explore Accessories
                                    </Link>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGE — FIXED WIDTH 423px, MATCH HEIGHT OF CARD */}
                    <div className="w-full lg:max-w-[423px]">
                        <div className="relative h-full min-h-[380px] lg:min-h-[412px] rounded-[20px] overflow-hidden bg-gray-200">
                            <Image
                                src="/images/hero/wireless.png"
                                alt="Antennas"
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
