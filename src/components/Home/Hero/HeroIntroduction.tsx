// components/Sections/NetworkIntro.tsx
import Link from "next/link";

export default function HeroIntroduction() {
    return (
        <section className="w-full">
            <div className="mx-auto max-w-7xl  py-12 lg:py-20">
                {/* Heading */}
                <h2 className="text-[#3a57b7] font-semibold leading-tight tracking-tight
                       text-3xl sm:text-5xl lg:text-[64px]">
                    Enabling Wireless Networks Since 2008
                </h2>

                {/* Paragraph */}
                <p className="mt-6 max-w-3xl text-[15px] sm:text-base leading-7 text-gray-600">
                    At ZDA Communications, we care about one thing above all: reliable wireless
                    performance. We design and supply industrial-grade antennas, cabling, and RF
                    accessories—plus practical tools like custom cable builds—that help homes,
                    enterprises, and field teams achieve clear, consistent connectivity. From fixed
                    sites to mobile deployments, our hardware is engineered for uptime, verified for
                    low VSWR, and built to stand up to real-world conditions so your network stays
                    steady when it matters.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href="/about"
                        className="inline-flex items-center rounded-full bg-[#3a57b7] hover:bg-[#2e4698]
                       text-white text-sm font-medium px-6 py-3 transition-colors"
                    >
                        More About Us
                    </Link>

                    <Link
                        href="/shop-with-sidebar"
                        className="inline-flex items-center rounded-full border border-[#3a57b7] 
             bg-transparent text-[#3a57b7] text-sm font-medium px-6 py-3 
             transition-colors hover:bg-[#3a57b7] hover:text-white"
                    >
                        Explore Products
                    </Link>

                </div>
            </div>
        </section>
    );
}
